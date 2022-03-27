import {IRegisterEmit} from "../models/user";
import express from "express";
import {userService} from "../services/init";
import {TOKEN_NAME} from "../constants/token.const";
import isAuth from "../middleware/isAuth";

const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
    try {
        const userData = req.body as IRegisterEmit;
        const token = (await userService.register(userData));
        res.cookie(TOKEN_NAME, token).send(await userService.getPublicUserDataByLogin(userData.login));
    } catch (e: any) {
        res.status(500).json(e.message);
    }
})

userRouter.get('/login', async (req, res) => {
    try {
        const {login, password} = req.query;
        if (!login || !password) {
            throw Error('Login or pass not present');
        }
        const token = await userService.login(login as string, password as string);
        res.cookie(TOKEN_NAME, token).send(await userService.getPublicUserDataByLogin(login as string));
    } catch (e: any) {
        res.status(500).json(e.message);
    }
})

userRouter.get('/logout', isAuth, async (req, res) => {
    try {
        res.clearCookie(TOKEN_NAME).send('User success logout');
    } catch (e: any) {
        res.status(500);
    }
})

userRouter.get('/', isAuth, async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[0] as string;
        res.json(await userService.getPublicUserDataByToken(token));
    } catch (e: any) {
        res.status(500);
    }
})

userRouter.get('/user-list', isAuth, async (req, res) => {
    try {
        res.json(await userService.getFullUserList());
    } catch (e) {
        res.status(500);
    }
})

export default userRouter;
