function ActionMessage(senderType: SenderType, string: string, finishAction: Function, disableAnimation?: boolean): HTMLElement
{
    const liClassName = (senderType == SenderType.User) ? "message message-user" : "message message-bot"
    const li = Create('li', liClassName);
    const p = Create('p', 'action-text', li);
    p.innerText = string;
    if (!disableAnimation && string)
        $(p).t({
            speed: 25,
            caret: false, fin: () =>
            {
                if (finishAction)
                    finishAction();
                p.ClearChildren();
                p.innerText = string;
            }
        });
    else if (finishAction) finishAction();
    return li;
}