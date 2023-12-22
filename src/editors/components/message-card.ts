function MessageCard(string: string, senderType: SenderType, contentType: ContentType, editAction: Function, menuFunctions?: MoreMenuFunction[]): HTMLElement
{
    if (contentType != ContentType.Image && string.length > 30) { string = string.substring(0, 30) + "..."; }
    const diaClassName = (contentType != ContentType.Speech) ? 'activity-dialogue dialogue-action' : (senderType == SenderType.User) ? 'activity-dialogue dialogue-speech-user' : 'activity-dialogue dialogue-speech-bot';
    const dia = Create('div', diaClassName);
    dia.append(CreateDynamicContent(string, contentType, 'span', '', 'card-image', dia));
    // if (contentType != ContentType.Image)
    // {
    //     const span = Create('span', '', dia);
    //     span.innerText = string;
    // }
    // else
    // {
    //     if (string.Contains(".mp4"))
    //     {
    //         const video = Create('video', 'card-image', dia) as HTMLVideoElement;
    //         video.src = string;
    //         video.autoplay = true;
    //         video.muted = true;
    //         video.loop = true;
    //     } else { const img = Create('img', 'card-image', dia) as HTMLImageElement; img.src = string; }
    // }
    const editButton = Create('button', 'edit-button', dia);
    $(editButton).on('click', () =>
    {
        if (editAction)
            editAction();
    })

    if (menuFunctions)
        dia.appendChild(new MoreMenu(menuFunctions).element);



    return dia;
}
