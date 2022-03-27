export enum ESocketEvents {
    GetMessage = '1'
}

export interface IMessage {
    recipientLogin: string;
    text: string;
}
