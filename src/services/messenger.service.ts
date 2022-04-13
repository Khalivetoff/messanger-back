import Service from "../models/service";
import Dialog from "./dialog.service";
import {userService} from "./init";
import Message from "./message.service";
import {IPublicUser} from "../models/user";
import {IDialog} from "../models/messenger";

class MessengerService extends Service {
    public constructor() {
        super('Dialog', {
            participantLoginList: [String],
            isGroup: Boolean,
            messageList: [{sendTime: String, isDelivered: Boolean, text: String, senderLogin: String}]
        });
    }

    private async createDialog(participantLoginList: string[], isGroup = false): Promise<Dialog & { _id: string }> {
        const dialog = new this.collection(new Dialog(participantLoginList, isGroup));
        await dialog.save();
        return dialog;
    }

    private async getDialogById(dialogId: string): Promise<Dialog & { _id: string }> {
        return this.getParsedDialog(await this.collection.findOne({_id: dialogId}) as Dialog & { _id: string })
    }

    private getParsedDialog(dialog: Dialog & { _id: string }): Dialog & { _id: string } {
        return {
            _id: dialog._id,
            participantLoginList: dialog.participantLoginList,
            isGroup: dialog.isGroup,
            messageList: dialog.messageList
        }
    }

    public async addMessageToDialog(dialogId: string, text: string, senderLogin: string): Promise<{ dialog: Dialog, message: Message }> {
        const dialog = await this.collection.findOne({_id: dialogId});
        if (!dialog) {
            throw Error('Dialog not found');
        }
        dialog?.messageList.push(new Message(text, senderLogin));
        await dialog.save();
        return {dialog, message: dialog.messageList[dialog.messageList.length - 1]}
    }

    public async addMessageToNewDialog(participantLoginList: string[], text: string, senderLogin: string, isGroup = false): Promise<Dialog> {
        const dialogId = (await this.createDialog(participantLoginList, isGroup))._id;
        await this.addMessageToDialog(String(dialogId), text, senderLogin);
        return await this.getDialogById(String(dialogId));
    }

    private getDialogWithCroppedMessageList(dialog: (Dialog & { _id: string }), start: number, end?: number): IDialog {
        const messageList = dialog.messageList.slice(start, end);
        return {
            ...dialog,
            messageList,
            isAllMessagesReceived: !!messageList.length && (messageList[0] as Message & { _id: string })._id === (dialog.messageList[0] as Message & { _id: string })._id
        };
    }

    public async getCroppedDialogList(login: string, start: number, end?: number): Promise<IDialog[]> {
        const dialogList = (await this.collection.find({participantLoginList: {$all: [login]}})) as (Dialog & { _id: string })[];
        return dialogList.map((dialog) => this.getDialogWithCroppedMessageList(
            this.getParsedDialog(dialog),
            start,
            end
        ));
    }

    public async getUserListWithoutCurrentUser(currentUserLogin: string): Promise<IPublicUser[]> {
        return (await userService.getFullUserList())?.filter(({login}) => login !== currentUserLogin);
    }

    public async getCroppedDialog(dialogId: string, messageIndex: number): Promise<IDialog> {
       return this.getDialogWithCroppedMessageList(await this.getDialogById(dialogId), -(messageIndex + 20), -messageIndex);
    }
}

export default MessengerService;
