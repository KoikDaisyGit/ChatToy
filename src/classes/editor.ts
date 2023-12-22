abstract class Editor
{
    private element: HTMLElement = $(`
        <div class="editor editor-activity container">
            <div class="editor-background"></div>
            
        </div>
    `)[0];
    private container: HTMLElement;
    private onCloseFunction: Function;
    private title: HTMLElement;
    constructor(onCloseFunction?: Function, noConfirmButton?: boolean)
    {
        this.onCloseFunction = onCloseFunction;

        const topBar = $(`<div class="top-bar"></div>`);

        const cancelButton = $('<button class="top-button cancel-button"></button>').on('click', () =>
        {
            this.Close();
        });
        $(topBar).append(cancelButton);
        this.title = $('<h2></h2>')[0];
        $(topBar).append(this.title);
        if (!noConfirmButton)
        {
            const doneButton = $('<button class="top-button done-button"></button>').on('click', () =>
            {
                this.ApplyModifications();
                this.Close();
            });
            $(topBar).append(doneButton);
        } else
        {
            $(topBar).append(`<div style="width:50px;height:50px;margin-right:10px;margin-left:auto;">`);
        }

        this.container = $(`<div class="editor-container"></div>`)[0];
        $(this.element).append(this.container);
        $(this.element).append(topBar);

        $(this.element).show();
    }
    public abstract ApplyModifications(): void;
    public abstract RefreshDisplay(): void;
    protected Close()
    {
        if (this.onCloseFunction) this.onCloseFunction();
        $(this.element).hide({ duration: 100, complete: () => { this.element.remove(); Data.Save(); } });
    }
    protected SetTitle(string: string)
    {
        this.title.innerText = string;
    }
    public AppendTo(element: HTMLElement)
    {
        element.appendChild(this.element);
    }
    public append(element: HTMLElement)
    {
        this.container.appendChild(element);
    }
    public SetChild(element: HTMLElement)
    {
        this.container.ClearChildren();
        this.container.appendChild(element);
    }
    public NewBox(): HTMLElement
    {
        const box = $(`<div class="editor-box"></div>`)[0];
        this.append(box);
        return box;
    }
}