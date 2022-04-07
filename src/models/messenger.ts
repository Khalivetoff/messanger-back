import Message from "../services/message.service";
import Dialog from "../services/dialog.service";

export enum ESocketEvents {
    Init = '2',
    AddMessageInDialog = '3',
    AddMessageInNewDialog = '4',
    DialogCreate = '5',
    ForceDisconnect = '6',
    GetMessages = '7',
    Message = '8'
}

export interface IAddMessageInDialogDataSend {
    dialogId: string;
    text: string;
}

export interface IAddMessageInNewDialogDataSend {
    companionLogin: string;
    text: string;
}

export interface IAddMessageInDialogDataGet {
    dialogId: string;
    message: Message;
}
