function StringCard(string: string, editFunction: (target: HTMLInputElement) => void, submitFunction?: Function, menuFunctions?: MoreMenuFunction[], focusIfEmpty?: boolean, textarea?: boolean)
{

    const inputDiv = Create('div', 'string-edit-wrapper');

    const inputWrapper = Create('div', 'string-edit', inputDiv);

    let input;
    const tag = textarea ? 'textarea' : 'input';

    if (textarea)
    {
        input = Create(tag, 'editor-input', inputWrapper) as HTMLTextAreaElement;
        input.addEventListener('keyup', (e: any) =>
        {
            const element = e.target as HTMLTextAreaElement;
            element.style.height = "5px";
            element.style.height = (element.scrollHeight) + "px";
        })
    } else
    {
        input = Create(tag, 'editor-input', inputWrapper) as HTMLInputElement;
    }
    input.value = string;
    input.rows = 1;
    setTimeout(() =>
    {
        input.style.height = "5px";
        input.style.height = (input.scrollHeight) + "px";
    }, 100);

    if (focusIfEmpty && (string === "<>" || string === ""))
    {
        setTimeout(() => { input.focus({ preventScroll: true }); input.value = ""; }, 50);
    }
    $(input).on('change', (e: any) =>
    {
        if (editFunction)
        {
            e.target.value = e.target.value.ReplaceAll("\n", "");
            editFunction(e.target);
        }
    });
    if (menuFunctions)
    {
        const deleteBtnWrapper = Create('div', 'string-delete', inputDiv);
        const deleteButton = new MoreMenu(menuFunctions).element;
        deleteBtnWrapper.appendChild(deleteButton);
    }

    if (submitFunction)
    {
        input.addEventListener("keydown", e =>
        {
            if (e.key == "Enter")
            {
                submitFunction();
            }
        })
    }
    return inputDiv;

}