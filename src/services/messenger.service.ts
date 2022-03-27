import Service from "../models/service";
import Dialog from "./dialog.service";
import MessengerItemService from "./messenger-item.service";
import {userService} from "./init";
import Message from "./message.service";

class MessengerService extends Service {
    public constructor() {
        super('Messenger', {
            senderId: String,
            dialogs: [{recipientId: String, messageList: [{sendTime: String, isDelivered: Boolean, text: String, isSentByOwner: Boolean}]}]
        });
    }

    public async addMessage(senderLogin: string, recipientLogin: string, text: string): Promise<void> {
        const [senderId, recipientId] = [await userService.getUserIdBuLogin(senderLogin), await userService.getUserIdBuLogin(recipientLogin)];
        if (!senderId || !recipientId) {
            throw Error('User not found');
        }
        const messengerItem = (await this.collection.findOne({senderId}));
        if (!messengerItem) {
            const dialog = new Dialog(recipientId);
            dialog.addMessage(text, senderId);
            const newMessengerItem = new this.collection(new MessengerItemService(senderId, [dialog]));
            newMessengerItem.save();
            return;
        }
        messengerItem.dialogs.find((dialog: Dialog) => dialog.recipientId === recipientId)?.messageList.push(new Message(text, senderId));
        messengerItem.save();
    }
}

export default MessengerService;
