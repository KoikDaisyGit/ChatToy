class MoreMenu
{
    constructor(actions: MoreMenuFunction[], displayBackground?: boolean)
    {
        const moreVertDiv = Create('div', 'more-vert-div');
        if (displayBackground) moreVertDiv.style.backgroundColor = "#0000003d";
        this.options = Create('ul', "more-vert-options-list more-vert-options-list-left", moreVertDiv);
        const moreVert = Create('button', 'more-vert', moreVertDiv) as HTMLButtonElement;
        $(moreVert).on('click', () =>
        {
            $(this.options).slideDown(200);
        });
        actions.forEach(action =>
        {
            if (action)
            {
                const option = Create('li', '', this.options);
                $(option).append(`<button class="more-vert-option" style="color:${action.color ? action.color : "white"};">${action.name}</button>`).on('click', () =>
                {
                    action.function();
                    document.removeEventListener('click', this.DomClickBound);
                });
            }
        });
        document.addEventListener('click', this.DomClickBound);
        this.element = moreVertDiv;
    }

    private DomClick(e: any)
    {
        if (!this.element) return;
        if (!this.element.contains(e.target))
        {
            $(this.options).slideUp(200);
        }
    }
    options: HTMLElement;
    private DomClickBound = this.DomClick.bind(this);
    element: HTMLElement;
}
interface MoreMenuFunction
{
    name: string,
    color?: string,
    function: Function
}