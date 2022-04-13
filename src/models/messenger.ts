import Message from "../services/message.service";
import Dialog from "../services/dialog.service";

export enum ESocketEvents {
    Init = '2',
    AddMessageInDialog = '3',
    AddMessageInNewDialog = '4',
    DialogCreate = '5',
    ForceDisconnect = '6',
    GetMessageList = '7',
    Message = '8'
}

export interface IAddMessageInDialogDataRequest {
    dialogId: string;
    text: string;
}

export interface IAddMessageInNewDialogRequest {
    companionLogin: string;
    text: string;
}

export interface IAddMessageInDialogRequest {
    dialogId: string;
    message: Message;
}

export interface IDialog extends Dialog {
    isAllMessagesReceived: boolean;
    _id: string;
}

export interface IGetMessageListRequest {
    dialogId: string;
    messageIndex: number;
}

export interface IGetMessageListResponse {
    dialogId: string;
    isAllMessagesReceived: boolean;
    messageList: Message[];
}
