import {IExternalUserWithToken, IRegisterEmit, IUser} from "../models/user";
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import {ERole} from "../models/role";
import {EXPIRATION, TOKENS} from "../constants/token.const";
import mongoose from "mongoose";

class UserService {
    private collection: typeof mongoose.Model;

    public constructor(collectionName: string, schema: mongoose.SchemaDefinition) {
        this.collection = mongoose.model(collectionName, new mongoose.Schema(schema));
    }

    private getGeneratedToken({_id, login, role}: IUser): string | undefined {
        const data = {_id, login};
        const signature = this.getSignatureByRole(role);
        if (!signature) {
            throw Error('Signature not found');
            return;
        }
        return jwt.sign({data}, signature, {expiresIn: EXPIRATION});
    }

    private getSignatureByRole = (role: ERole): string | undefined => {
        return TOKENS[role];
    }

    public async getFullUserByLogin(login: string): Promise<null | IUser> {
        return (await this.collection.findOne({login}));
    }

    public async login(login: string, password: string): Promise<IExternalUserWithToken> {
        const userData = await this.getFullUserByLogin(login);
        if (!userData) {
            throw Error('User not found');
        }
        if (!await argon2.verify(userData.password, password)) {
            throw Error('Incorrect password');
        }
        const token = this.getGeneratedToken(userData);
        if (!token) {
            throw Error('Token create error');
        }
        return {
            data: {
                login,
                name: userData?.name
            },
            token
        }
    }

    public async register(userData: IRegisterEmit): Promise<IExternalUserWithToken> {
        try {
            const createdUserData = new this.collection({
                ...userData,
                role: ERole.User,
                password: await argon2.hash(userData.password)
            } as IUser);
            await createdUserData.save();
            return (await this.login(createdUserData.login, userData.password));
        } catch (e) {
            throw Error(e as string);
        }
    }
}

export default UserService;
