import moment from "moment";

class Message {
    public sendTime = moment().format();
    public isDelivered = false;

    public constructor(public text: string, public senderLogin: string) {}
}

export default Message;
