import Dialog from "./dialog.service";

class MessengerItemService {
    public constructor(public senderId: string, public dialogs: Dialog[]) {}
}

export default MessengerItemService;
