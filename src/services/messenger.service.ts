import Service from "../models/service";
import Dialog from "./dialog.service";
import MessengerItemService from "./messenger-item.service";
import {userService} from "./init";
import Message from "./message.service";
import mongoose from "mongoose";

class MessengerService extends Service {
    public constructor() {
        super('Dialog', {
            participantListId: [String],
            isGroup: Boolean,
            messageList: [{sendTime: String, isDelivered: Boolean, text: String, isSentByOwner: Boolean}]
        });
    }

    public async createDialog(participantIdList: string[], isGroup = false): Promise<string> {
        const dialog = new this.collection(new Dialog(participantIdList, isGroup));
        dialog.save();
        return dialog._id;
    }

    public async getDialogById(dialogId: string): Promise<Dialog | null> {
        return await this.collection.findOne({_id: dialogId});
    }

    public async getDialogListByUserId(userId: string): Promise<Dialog[]> {
        return (await this.collection.find({participantListId: {$all: [userId]}}))
    }

    public async addMessageToDialog(dialogId: string, text: string, senderId: string): Promise<void> {
        const currentDialog = await this.collection.findOne({_id: dialogId});
        if (!currentDialog) {
            throw Error('Dialog not found');
        }
        currentDialog?.messageList.push(new Message(text, senderId));
        currentDialog.save();
    }

    public async addMessageToNewDialog(participantLoginList: string[], text: string, senderId: string, senderLogin: string, isGroup = false): Promise<void> {
        const userIdList = participantLoginList.map(async (login) => (await userService.getUserIdBuLogin(login))) as unknown as string[];
        const dialogId = await this.createDialog(userIdList, isGroup);
        this.addMessageToDialog(dialogId, text, await userService.getUserIdBuLogin(senderLogin) as string);
    }
}

export default MessengerService;
