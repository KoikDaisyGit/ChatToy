function SpeechBubble(senderType: SenderType, contentType: ContentType, string: string, finishAction: Function, disableAnimation?: boolean): HTMLElement
{
    const className = (senderType == SenderType.Bot) ? 'speech-bubble speech-bubble-bot' : 'speech-bubble speech-bubble-user';
    const bubble = Create('div', className);
    if (contentType == ContentType.Speech)
    {
        const p = Create('p', '', bubble);
        p.innerText = string;
        if (!disableAnimation && string && senderType == SenderType.Bot)
        {
            $(p).t({
                caret: false,
                speed: 10,
                speed_vary: true,
                mistype: true,
                fin: () =>
                {
                    if (finishAction)
                        finishAction();
                    p.ClearChildren();
                    p.innerText = string;
                }
            });
        } else
        {
            if (finishAction) finishAction();
        }
    }
    else if (string)
    {
        const file = Files.GetFile(string);
        if (file?.file.type.toLowerCase().Contains("video"))
        {
            const video = Create('video', 'bubble-image', bubble) as HTMLVideoElement
            video.src = file?.url;
            video.muted = true;
            video.autoplay = true;
            video.loop = true;
        }
        else
        {
            const img = Create('img', 'bubble-image', bubble) as HTMLImageElement
            img.src = file?.url;
        }
        if (finishAction) finishAction();
    }
    return bubble;
}

interface JQuery
{
    t(): void;
    t(any: any): void;
}

interface ImagePaths
{

}

const imagePaths: ImagePaths = null;