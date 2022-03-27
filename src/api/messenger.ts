import {Socket} from "socket.io";
// import {ESocketEvents, IMessage} from "../models/socket";
// import {messengerService, userService} from "../services/init";

const initMessengerSocket = async (socket: Socket): Promise<void> => {
    // socket.on(ESocketEvents.GetMessage, (data: IMessage) => {
    //     console.log(data);
    //     messengerService.addMessage(socket.handshake.auth.login, data.recipientLogin, data.text);
    // })
}

export default initMessengerSocket;
