function UserChatMessage(contentType: ContentType, message: string, finishAction: Function, disableAnimation?: boolean): HTMLElement
{
    const li = Create('li', 'message message-user');
    const bubble = SpeechBubble(SenderType.User, contentType, message, finishAction, disableAnimation);
    li.appendChild(bubble);
    if (contentType == ContentType.Speech)
        Create('div', 'bubbletail bubbletail-user', bubble);
    if (Data.userPfp)
    {
        const pfp = Create('img', 'pfp', li);
        const img = pfp as HTMLImageElement;
        img.src = Files.GetFile(Data.userPfp).url;
    }

    return li;
}