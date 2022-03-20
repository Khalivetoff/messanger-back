import UserService from "./user.service";

export const userService = new UserService('User', {
    login: String,
    password: String,
    role: Number,
    name: String
});
