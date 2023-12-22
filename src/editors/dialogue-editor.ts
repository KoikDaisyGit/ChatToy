class DialogueEditor extends Editor
{
    private dialogue: Dialogue;
    private model: { title: string, userMessage: Message, exchanges: Exchange[] };
    constructor(dialogue: Dialogue, onCloseFunction?: Function)
    {
        super(onCloseFunction);

        this.dialogue = dialogue;
        this.model = {
            title: dialogue.title,
            userMessage: $.extend(true, {}, dialogue.userMessage),
            exchanges: $.extend(true, [], dialogue.exchanges)
        }

        this.RefreshDisplay();
    }
    ApplyModifications(): void
    {
        this.dialogue.title = this.model.title;
        this.dialogue.exchanges = this.model.exchanges;
        this.dialogue.userMessage = this.model.userMessage;

    }
    RefreshDisplay()
    {
        this.SetTitle(this.model.title);
        let box = this.NewBox();
        this.SetChild(box);



        const titleLabel = Create('h3', '', box);
        titleLabel.innerText = "Title/Search Term";
        const titleGroup = Create('div', 'editor-title-div', box);
        const inputDiv = Create('div', '', titleGroup);
        const titleInput = Create('input', 'editor-input', inputDiv) as HTMLInputElement;
        titleInput.value = this.model.title;
        if (this.model.title == "" || this.model.title == "<>")
        {
            setTimeout(() => { titleInput.focus(); titleInput.value = ""; }, 50);
        }
        titleInput.addEventListener('change', (e: any) =>
        {
            this.model.title = e.target.value;
            if (this.model.title == "")
            {
                this.model.title = "<>";
                e.target.value = "<>";
            }
            this.SetTitle(this.model.title);
        });

        box = this.NewBox();
        $(box).append(`<h3>Initial Message</h3>`);

        const umDiv = Create('div', 'form-group row', box);
        const message = this.model.userMessage;
        console.log(message.strings[0]);
        console.log(Files.GetFile(message.strings[0]));
        umDiv.appendChild(MessageCard(message.strings[0], message.senderType, message.contentType, () =>
        {
            this.ApplyModifications();
            EditorManager.Open(new MessageEditor(message, this.RefreshDisplay.bind(this)));
        }, [{
            name: "Copy",
            color: "white",
            function: () => { Data.clipboard = { type: ClipData.Message, value: Clone(message) }; this.RefreshDisplay(); }
        }, (Data.clipboard.type == ClipData.Message) ? {
            name: "Paste",
            color: "white",
            function: () => { this.model.userMessage = Data.clipboard.value; this.RefreshDisplay(); }
        } : null]));

        box = this.NewBox();
        $(box).append(`<h3>Possible Exchanges</h3>`);
        const list = SearchableList(this.model.exchanges, (ex, index) =>
        {
            const message = ex.messages[0];
            const div = Create('div');
            console.log(message.strings[0]);
            const card = MessageCard(message.strings[0] + "...", message.senderType, message.contentType,
                () =>
                {
                    this.ApplyModifications();
                    let editor = new ExchangeEditor(ex, this.RefreshDisplay.bind(this));
                    EditorManager.Open(editor);
                    if (ex.messages[0]?.strings[0] == "<>")
                        EditorManager.Open(new MessageEditor(ex.messages[0], editor.RefreshDisplay.bind(editor)));
                }, MoreMenuArrayFunctions(this, this.model.exchanges, index, div, ClipData.Exchange));
            div.append(card);
            return div;
        }, () => new Exchange([new Message(0, 0, ["<>"])]));
        box.append(list);
    }
}