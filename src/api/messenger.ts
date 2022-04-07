import {Socket} from "socket.io";
import {
    ESocketEvents,
    IAddMessageInDialogDataGet,
    IAddMessageInDialogDataSend,
    IAddMessageInNewDialogDataSend
} from "../models/messenger";
import {messengerService} from "../services/init";
import {io} from "../app";

const initMessengerSocket = async (socket: Socket): Promise<void> => {
    socket.emit(ESocketEvents.Init, {
        userList: await messengerService.getUserListWithoutCurrentUser(socket.handshake.auth.login),
        //FIXME: реализовать загрузку загрузку сообщений по кускам
        // dialogList: await messengerService.getCroppedDialogList(socket.handshake.auth.login, -20)
        dialogList: await messengerService.getCroppedDialogList(socket.handshake.auth.login, 0)
    })

    socket.on(ESocketEvents.ForceDisconnect, () => {
        socket.disconnect();
    })

    socket.on(ESocketEvents.AddMessageInDialog, async (data: IAddMessageInDialogDataSend) => {
        const {dialog, message} = await messengerService.addMessageToDialog(data.dialogId, data.text, socket.handshake.auth.login);
        Array.from(io.sockets.sockets.values()).forEach((socket) => {
            dialog.participantLoginList.includes(socket.handshake.auth.login) && socket.emit(ESocketEvents.Message, {
                dialogId: data.dialogId,
                message
            } as IAddMessageInDialogDataGet)
        })
    })

    socket.on(ESocketEvents.AddMessageInNewDialog, async (data: IAddMessageInNewDialogDataSend) => {
        const dialog = await messengerService.addMessageToNewDialog(
            [data.companionLogin, socket.handshake.auth.login],
            data.text,
            socket.handshake.auth.login,
            false);
        Array.from(io.sockets.sockets.values()).forEach((socket) => {
            dialog.participantLoginList.includes(socket.handshake.auth.login) && socket.emit(ESocketEvents.DialogCreate, dialog);
        })
    })
}

export default initMessengerSocket;
