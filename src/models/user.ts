import {ERole} from "./role";

export interface IUser {
    _id: string;
    login: string;
    password: string;
    role: ERole;
    name: string;
}

export interface IRegisterEmit {
    login: string;
    password: string;
    name: string;
}

export interface ISetTokenEmit {
    [key: string]: unknown;
    _id: string;
    login: string;
}
