function ColorPicker(color: string, editAction: (target: HTMLInputElement) => void): HTMLElement
{
    if (color == "") color = "#FFFFFF";
    const userColor = Create('input', 'color-picker') as HTMLInputElement;
    userColor.type = "color";
    userColor.value = color;
    $(userColor).on('change', (e) =>
    {
        editAction(e.target);
    });
    return userColor;
}