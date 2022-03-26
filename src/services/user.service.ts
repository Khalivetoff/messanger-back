import {IRegisterEmit, ISetTokenEmit, IUser} from "../models/user";
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import {ERole} from "../models/role";
import {EXPIRATION, SECRET_TOKEN} from "../constants/token.const";
import mongoose from "mongoose";
import Service from "../models/service";

class UserService extends Service {

    public constructor(collectionName: string, schema: mongoose.SchemaDefinition) {
        super(collectionName, schema);
    }

    public getGeneratedToken(data: ISetTokenEmit): string {
        return jwt.sign({_id: data._id, login: data.login}, SECRET_TOKEN, {expiresIn: EXPIRATION});
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

    public async getFullUserByLogin(login: string): Promise<null | IUser> {
        return (await this.collection.findOne({login}));
    }

    public async login(login: string, password: string): Promise<string> {
        const userData = await this.getFullUserByLogin(login);
        if (!userData) {
            throw Error('User not found');
        }
        if (!await argon2.verify(userData.password, password)) {
            throw Error('Incorrect password');
        }
        const token = this.getGeneratedToken({_id: String(userData._id), login: userData.login});
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
}

export default UserService;
