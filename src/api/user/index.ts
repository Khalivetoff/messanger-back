import {IRegisterEmit} from "../../models/user";
import express from "express";
import {userService} from "../../services/init";
import {TOKEN_NAME} from "../../constants/token.const";
import isAuth from "../../middleware/isAuth";

const user = express.Router();

user.post('/register', async (req, res) => {
    try {
        const userData = req.body as IRegisterEmit;
        const token = (await userService.register(userData));
        res.cookie(TOKEN_NAME, token).send(await userService.getPublicUserDataByLogin(userData.login));
    } catch (e: any) {
        res.status(500).json(e.message);
    }
})

user.get('/login', async (req, res) => {
    try {
        const [login, password] = [req.query.login, req.query.password];
        if (!login || !password) {
            throw Error('Login or pass not present');
        }
        const token = await userService.login(login as string, password as string);
        res.cookie(TOKEN_NAME, token).send(await userService.getPublicUserDataByLogin(login as string));
    } catch (e: any) {
        res.status(500).json(e.message);
    }
})

user.get('/', isAuth, async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[0] as string;
        res.json(await userService.getPublicUserDataByToken(token));
    } catch (e: any) {
        res.status(500);
    }
})

export default user;
