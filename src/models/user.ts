import {ERole} from "./role";

export interface IUser {
    _id: string;
    login: string;
    password: string;
    role: ERole;
    name: string;
}

export interface IExternalUser {
    login: string;
    name: string;
}

export interface IExternalUserWithToken {
    token: string;
    data: IExternalUser;
}

export interface IRegisterEmit {
    login: string;
    password: string;
    name: string;
}
