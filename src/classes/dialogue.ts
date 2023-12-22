class Dialogue
{
    constructor(title: string, userMessage: Message, scenes: Exchange[])
    {
        this.title = title;
        this.exchanges = scenes;
        this.userMessage = userMessage;
    }
    title: string = "";
    userMessage: Message;
    exchanges: Exchange[] = [];
}