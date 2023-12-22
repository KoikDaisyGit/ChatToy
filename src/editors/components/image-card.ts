function ImageCard(src: string, editFunction: Function, menuFunctions?: MoreMenuFunction[]): HTMLElement
{
    const div = Create('div', 'activity-dialogue dialogue-action');
    CreateDynamicContent(src, ContentType.Image, '', '', 'card-image', div);
    const editButton = Create('button', 'edit-button', div);
    $(editButton).on('click', () =>
    {
        if (editFunction)
            editFunction();
    })
    if (menuFunctions)
    {
        const deleteBtnWrapper = Create('div', 'string-delete', div);
        const deleteButton = new MoreMenu(menuFunctions).element;
        deleteBtnWrapper.appendChild(deleteButton);
    }
    return div;
}