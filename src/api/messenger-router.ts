import {Socket} from "socket.io";
import {
    ESocketEvents,
    IAddMessageInDialogRequest,
    IAddMessageInDialogDataRequest,
    IAddMessageInNewDialogRequest,
    IGetMessageListRequest,
    IGetMessageListResponse
} from "../models/messenger";
import {messengerService} from "../services/init";
import {io} from "../app";

const initMessengerSocket = async (socket: Socket): Promise<void> => {
    socket.emit(ESocketEvents.Init, {
        userList: await messengerService.getUserListWithoutCurrentUser(socket.handshake.auth.login),
        dialogList: await messengerService.getCroppedDialogList(socket.handshake.auth.login, -20)
    })

    socket.on(ESocketEvents.ForceDisconnect, () => {
        socket.disconnect();
    })

    socket.on(ESocketEvents.AddMessageInDialog, async (data: IAddMessageInDialogDataRequest) => {
        const {dialog, message} = await messengerService.addMessageToDialog(data.dialogId, data.text, socket.handshake.auth.login);
        Array.from(io.sockets.sockets.values()).forEach((socket) => {
            dialog.participantLoginList.includes(socket.handshake.auth.login) && socket.emit(ESocketEvents.Message, {
                dialogId: data.dialogId,
                message
            } as IAddMessageInDialogRequest)
        })
    })

    socket.on(ESocketEvents.AddMessageInNewDialog, async (data: IAddMessageInNewDialogRequest) => {
        const dialog = await messengerService.addMessageToNewDialog(
            [data.companionLogin, socket.handshake.auth.login],
            data.text,
            socket.handshake.auth.login,
            false);
        Array.from(io.sockets.sockets.values()).forEach((socket) => {
            dialog.participantLoginList.includes(socket.handshake.auth.login) && socket.emit(ESocketEvents.DialogCreate, dialog);
        })
    })

    socket.on(ESocketEvents.GetMessageList, async ({dialogId, messageIndex}: IGetMessageListRequest) => {
        const {_id, messageList, isAllMessagesReceived} = await messengerService.getCroppedDialog(dialogId, messageIndex);
        if (!_id) {
            return;
        }
        socket.emit(ESocketEvents.GetMessageList, {dialogId: _id, messageList, isAllMessagesReceived} as IGetMessageListResponse);
    })
}

export default initMessengerSocket;
