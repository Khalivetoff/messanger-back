export enum ESocketEvents {
    Init = '2',
    AddMessageInDialog = '3',
    AddMessageInNewDialog = '4',
    DialogCreate = '5',
    ForceDisconnect = '6',
    GetMessages = '7'
}

export interface ISocketWrapper<T = unknown> {
    queue: number;
    data: T;
}
