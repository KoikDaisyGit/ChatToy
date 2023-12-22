class Message
{
    constructor(senderType: SenderType, contentType: ContentType, strings: string[], emoji?: string[])
    {
        this.strings = strings;
        this.contentType = contentType;
        this.senderType = senderType;
        this.emoji = emoji;
    }
    strings: string[] = [];
    contentType: ContentType;
    senderType: SenderType;
    emoji: string[] = [];
}