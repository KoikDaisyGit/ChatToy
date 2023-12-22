function BotChatMessage(contentType: ContentType, pfpUrl: string, message: string, finishAction: Function, emoji?: string, disableAnimation?: boolean): HTMLElement
{
    const li = Create('li', 'message message-bot');
    const pfp = Create('img', 'pfp', li) as HTMLImageElement;
    pfp.src = Files.GetFile(pfpUrl)?.url;
    const bubble = SpeechBubble(SenderType.Bot, contentType, message, () =>
    {
        if (emoji)
        {
            const p = Create('p', 'emoji', li);
            p.innerText = emoji;
        }
        if (finishAction) { finishAction(); }

    }, disableAnimation);
    li.appendChild(bubble);
    if (disableAnimation && emoji)
    {
        const p = Create('p', 'emoji', li);
        p.innerText = emoji;
    }
    if (contentType == ContentType.Speech)
        Create('div', 'bubbletail bubbletail-bot', bubble);


    return li;
}