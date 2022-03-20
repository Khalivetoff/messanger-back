import {IRegisterEmit} from "../../models/user";
import express from "express";
import {userService} from "../../services/init";

const user = express.Router();

user.post('/register', async (req, res) => {
    try {
        const userData = req.body as IRegisterEmit;
        const createdUserData = (await userService.register(userData));
        res.cookie('token', createdUserData.token).send(createdUserData.data);
    } catch (e) {
        res.status(500).send();
        throw Error();
    }
})

user.get('/login/:login/:password', async (req, res) => {
    try {
        const [login, password] = [req.params.login, req.params.password]
        const authUserData = (await userService.login(login, password));
        res.cookie('token', authUserData.token).send(authUserData.data);
    } catch (e) {
        res.status(500).send();
        throw Error();
    }
})

export default user;
