import {Socket} from "socket.io";
import {ESocketEvents, ISocketWrapper} from "../models/messenger";
import {messengerService} from "../services/init";

const initMessengerSocket = async (socket: Socket): Promise<void> => {
    socket.emit(ESocketEvents.Init, {
        userList: await messengerService.getUserListWithoutCurrentUser(socket.handshake.auth.login),
        dialogList: await messengerService.getCroppedDialogList(socket.handshake.auth.login, [0, 20])
    })

    socket.on(ESocketEvents.AddMessageInDialog, async (wrapper: ISocketWrapper<{ dialogId: string, text: string }>) => {
        const {data} = wrapper;
        await messengerService.addMessageToDialog(data.dialogId, data.text, socket.handshake.auth.login);
    })

    socket.on(ESocketEvents.ForceDisconnect, () => {
        socket.disconnect();
    })

    socket.on(ESocketEvents.AddMessageInNewDialog, async (
        wrapper: ISocketWrapper<{ companionLogin: string, text: string }>
    ) => {
        const {data} = wrapper;
        const newDialog = await messengerService.addMessageToNewDialog([data.companionLogin, socket.handshake.auth.login], data.text, socket.handshake.auth.login, false);
        socket.emit(ESocketEvents.DialogCreate, newDialog);
    })
}

export default initMessengerSocket;
