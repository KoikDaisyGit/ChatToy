function RadioPicker(idendifier: string, elements: { label: string, function: Function, active: boolean }[]): HTMLElement
{
    const radioDiv = Create('div', 'editor-radio-div');
    elements.forEach(element =>
    {
        const thing = Create('div', '', radioDiv);
        const option = $(`<input type="radio", name="${idendifier}" ${element.active ? "checked" : ""}>`)[0] as HTMLInputElement;
        $(option).on('change', (e) =>
        {
            if (element.function) element.function();
        });
        thing.appendChild(option);
        $(thing).append(`<label>${element.label}</label>`);
    });
    return radioDiv;
}