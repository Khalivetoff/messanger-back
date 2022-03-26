import {NextFunction, Request, Response} from "express";
import {TOKEN_NAME} from "../constants/token.const";
import {userService} from "../services/init";

const isAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers?.authorization?.split(' ')[0] as string;
        const user = await userService.getPublicUserDataByToken(token);
        res.cookie(TOKEN_NAME, userService.getGeneratedToken(user));
        next();
    } catch (e: any) {
        res.status(403).send('User is not auth');
        throw Error(e.message);
    }
}

export default isAuth;
