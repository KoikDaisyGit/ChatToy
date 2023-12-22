class Exchange
{
    constructor(messages: Message[], dialoguePaths?: Dialogue[], switchToActivity?: string)
    {
        this.messages = messages;
        this.dialoguePaths = dialoguePaths;
        this.switchToActivity = switchToActivity;
    }
    switchToActivity: string = "";
    messages: Message[] = [];
    dialoguePaths: Dialogue[] = [];
}