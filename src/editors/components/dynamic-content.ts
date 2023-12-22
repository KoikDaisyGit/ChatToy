function CreateDynamicContent(string: string, contentType: ContentType, speechTag: string, speechClassName: string, imageClassName: string, parentElement?: HTMLElement): HTMLElement
{
    if (contentType == ContentType.Image)
    {
        const file = Files.GetFile(string);

        if (file?.file.type.Contains("video"))
        {
            const video = Create('video', imageClassName, parentElement) as HTMLVideoElement;
            video.src = file?.url ? file.url : "assets/image.png";
            video.muted = true;
            video.loop = true;
            video.autoplay = true;
            return video;
        } else
        {
            const img = Create('img', imageClassName, parentElement) as HTMLImageElement;
            img.src = file?.url ? file.url : "assets/image.png";
            return img;
        }
    } else
    {
        const stringtag = Create(speechTag, speechClassName, parentElement);
        stringtag.innerText = string.ReplaceAll("<>", "");
        return stringtag;
    }
}