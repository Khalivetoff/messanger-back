import {IRegisterEmit} from "../../models/user";
import express from "express";
import {userService} from "../../services/init";
import {TOKEN_NAME} from "../../constants/token.const";

const user = express.Router();

user.post('/register', async (req, res) => {
    try {
        const userData = req.body as IRegisterEmit;
        const token = (await userService.register(userData));
        res.cookie(TOKEN_NAME, token).send();
    } catch (e: any) {
        res.status(500).json(e.message);
    }
})

user.get('/login', async (req, res) => {
    try {
        const [login, password] = [req.query.login, req.query.password];
        const token = await userService.login(login as string, password as string);
        res.cookie(TOKEN_NAME, token).send();
    } catch (e: any) {
        res.status(500).json(e.message);
    }
})

export default user;
