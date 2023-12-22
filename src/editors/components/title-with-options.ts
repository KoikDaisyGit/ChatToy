function TitleWithOptions(title: string, options: MoreMenuFunction[]): HTMLElement
{
    const div = Create('div', 'options-title-div');
    const h3 = Create('h3', 'options-title', div);
    h3.innerText = title;
    div.append(new MoreMenu(options, true).element);
    return div;
}