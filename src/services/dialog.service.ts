import Message from "./message.service";

class Dialog {
    public messageList: Message[];

    public constructor(public participantLoginList: string[], public isGroup = false) {
        this.messageList = [];
    };
}

export default Dialog;
