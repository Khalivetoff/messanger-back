import express from "express";
import isAuth from "../middleware/isAuth";
import {messengerService} from "../services/init";

const messengerRouter = express.Router();

messengerRouter.get('/test', isAuth, (req, res) => {
    res.send('test')
})

messengerRouter.post('/send', isAuth, async (req, res) => {
    try {
        const {ownerLogin, interlocutorLogin} = req.query;
        const text = req.body.text;
        await messengerService.addMessage(ownerLogin as string, interlocutorLogin as string, text);
        res.send('Message sent success');
    } catch (e: any) {
        res.status(500).send(e.message);
    }
})

export default messengerRouter;

