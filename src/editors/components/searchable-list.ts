function SearchableList<T>(list: T[], templateFunction: (item: T, index: number, addFunction: Function) => HTMLElement, getNewElement?: () => T, getSearchTerm?: (item: T) => string, listMenuFunctions?: MoreMenuFunction[]): HTMLElement
{
    const div = Create('div', '');
    const flex = Create('div', 'flex-box', div);
    let addButtonLI: HTMLElement;

    let searchTerm = "";
    if (getSearchTerm)
    {
        const input = Create('input', 'editor-input', flex) as HTMLInputElement;
        input.type = "search";
        input.placeholder = "Search...";
        input.addEventListener('change', (e: any) =>
        {
            searchTerm = e.target.value;
            RefreshDisplay();
        });
    }
    if (listMenuFunctions)
        flex.append(new MoreMenu(listMenuFunctions, true).element);
    const ul = Create('ul', 'editor-ul', div) as HTMLUListElement;
    function RefreshDisplay()
    {
        ul.ClearChildren();
        list?.forEach((item, index: number) =>
        {
            if (!getSearchTerm || !searchTerm || getSearchTerm(item).toLowerCase().Contains(searchTerm.toLowerCase()))
            {
                const li = Create('li', '', ul);
                const card = templateFunction(item, index, AddListElement);
                li.appendChild(card);
            }
        });
        if (getNewElement)
        {
            AppendAddButton();
        }
    }

    RefreshDisplay();



    function AddListElement() 
    {
        addButtonLI?.remove();

        const newItem = getNewElement();
        list.push(newItem);

        const card = templateFunction(newItem, list.length - 1, AddListElement);

        ul.appendChild(card);
        AppendAddButton();
    };

    function AppendAddButton()
    {
        addButtonLI = Create('li', '', ul);
        $(addButtonLI).append(`<button class="add-button">+</button>`).on('click', AddListElement);
    }



    return div;
}