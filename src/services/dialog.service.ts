import Message from "./message.service";

class Dialog {
    public messageList: Message[];

    public constructor(public recipientId: string) {
        this.messageList = [];
    };

    public addMessage(text: string, senderId: string): void {
        this.messageList.push(new Message(text, senderId));
    }
}

export default Dialog;
