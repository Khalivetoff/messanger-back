import Service from "../models/service";
import Dialog from "./dialog.service";
import {userService} from "./init";
import Message from "./message.service";
import {IPublicUser} from "../models/user";

class MessengerService extends Service {
    public constructor() {
        super('Dialog', {
            participantLoginList: [String],
            isGroup: Boolean,
            messageList: [{sendTime: String, isDelivered: Boolean, text: String, senderLogin: String}]
        });
    }

    private async createDialog(participantLoginList: string[], isGroup = false): Promise<Dialog & {_id: string}> {
        const dialog = new this.collection(new Dialog(participantLoginList, isGroup));
        dialog.save();
        return dialog;
    }

    public async addMessageToDialog(dialogId: string, text: string, senderLogin: string): Promise<Dialog> {
        const currentDialog = await this.collection.findOne({_id: dialogId});
        if (!currentDialog) {
            throw Error('Dialog not found');
        }
        currentDialog?.messageList.push(new Message(text, senderLogin));
        currentDialog.save();
        return currentDialog;
    }

    public async addMessageToNewDialog(participantLoginList: string[], text: string, senderLogin: string, isGroup = false): Promise<Dialog> {
        const dialogId = (await this.createDialog(participantLoginList, isGroup))._id;
        return await this.addMessageToDialog(dialogId, text, senderLogin);
    }

    private getDialogWithCroppedMessageList(dialog: (Dialog & {_id: string}), interval: [number, number]): Dialog & {_id: string} {
        return {...dialog, messageList: dialog.messageList.slice(interval[0], interval[1])}
    }

    public async getCroppedDialogList(login: string, interval: [number, number]): Promise<(Dialog & { _id: string })[]> {
        const dialogList = (await this.collection.find({participantLoginList: {$all: [login]}})) as (Dialog & { _id: string })[];
        return dialogList.map((dialog) => this.getDialogWithCroppedMessageList(
            {
                messageList: dialog.messageList,
                _id: dialog._id,
                participantLoginList: dialog.participantLoginList,
                isGroup: dialog.isGroup
            },
            [0, 20]
        ));
    }

    public async getUserListWithoutCurrentUser(currentUserLogin: string): Promise<IPublicUser[]> {
        return (await userService.getFullUserList())?.filter(({login}) => login !== currentUserLogin);
    }
}

export default MessengerService;
