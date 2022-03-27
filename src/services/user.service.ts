import {IPublicUser, IRegisterEmit, IUser} from "../models/user";
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import {ERole} from "../models/role";
import {EXPIRATION, SECRET_TOKEN} from "../constants/token.const";
import Service from "../models/service";

class UserService extends Service {

    public constructor() {
        super('User', {
            login: String,
            password: String,
            role: Number,
            name: String
        });
    }

    public getGeneratedToken(data: IPublicUser): string {
        return jwt.sign({login: data.login, name: data.name, role: data.role}, SECRET_TOKEN, {expiresIn: EXPIRATION});
    }

    private async checkUserByLoginAndName(login: string, name: string): Promise<void> {
        const savedUser: IUser | null = (await this.collection.findOne({$or: [{login}, {name}]}));
        if (!savedUser) {
            return;
        }
        if (savedUser.login === login) {
            throw Error('Login is taken');
        }
        if (savedUser.name === name) {
            throw Error('Name is taken');
        }
    }

    public async getFullUserDataByLogin(login: string): Promise<null | IUser> {
        return (await this.collection.findOne({login}));
    }

    public async getPublicUserDataByToken(token: string): Promise<IPublicUser> {
        return await jwt.verify(token, SECRET_TOKEN) as IPublicUser;
    }

    public async getUserIdBuLogin(login: string): Promise<string | undefined> {
        return (await this.getFullUserDataByLogin(login))?._id?.toString();
    }

    public async getPublicUserDataByLogin(login: string): Promise<IPublicUser> {
        const user = await this.getFullUserDataByLogin(login);
        if (!user) {
            throw Error('User not found');
        }
        return {login: user.login, role: user.role, name: user.name};
    }

    public async login(login: string, password: string): Promise<string> {
        const userData = await this.getFullUserDataByLogin(login);
        if (!userData) {
            throw Error('User not found');
        }
        if (!await argon2.verify(userData.password, password)) {
            throw Error('Incorrect password');
        }
        const token = this.getGeneratedToken({login: userData.login, name: userData.name, role: userData.role});
        if (!token) {
            throw Error('Token create error');
        }
        return token;
    }

    public async register(userData: IRegisterEmit): Promise<string> {
        try {
            await this.checkUserByLoginAndName(userData.login, userData.name);
            const createdUserData = new this.collection({
                ...userData,
                role: ERole.User,
                password: await argon2.hash(userData.password)
            } as IUser);
            await createdUserData.save();
            return await this.login(createdUserData.login, userData.password);
        } catch (e: any) {
            throw Error(e.message);
        }
    }

    public async getFullUserList(): Promise<IPublicUser[]> {
        return (await this.collection.find())?.map(({login, role, name}) => ({ login, role, name }));
    }
}

export default UserService;
