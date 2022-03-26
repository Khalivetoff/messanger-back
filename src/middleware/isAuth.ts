import {NextFunction, Request, Response} from "express";
import * as jwt from 'jsonwebtoken';
import {SECRET_TOKEN, TOKEN_NAME} from "../constants/token.const";
import {userService} from "../services/init";
import {ISetTokenEmit} from "../models/user";

const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers?.authorization?.split(' ')[0] as string;
        const user = await jwt.verify(token, SECRET_TOKEN) as ISetTokenEmit;
        res.cookie(TOKEN_NAME, userService.getGeneratedToken(user));
        next();
    } catch (e: any) {
        res.status(403).send('User is not auth');
        throw Error(e.message);
    }
}

export default isAuth;
