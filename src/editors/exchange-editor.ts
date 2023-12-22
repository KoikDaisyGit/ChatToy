class ExchangeEditor extends Editor
{
    private exchange: Exchange;

    private model: { messages: Message[], switchToActivity: string, dialogueChoices: Dialogue[] }

    constructor(exchange: Exchange, closeAction: Function)
    {
        super(closeAction);
        this.SetTitle("Exchange");
        this.exchange = exchange;
        this.model = {
            messages: $.extend(true, [], exchange.messages),
            dialogueChoices: $.extend(true, [], exchange.dialoguePaths),
            switchToActivity: exchange.switchToActivity ? exchange.switchToActivity : ""
        }
        this.RefreshDisplay();
    }
    ApplyModifications(): void
    {
        this.exchange.messages = this.model.messages;
        this.exchange.dialoguePaths = this.model.dialogueChoices;
        this.exchange.switchToActivity = this.model.switchToActivity;
    }
    public RefreshDisplay()
    {
        let box = this.NewBox();
        this.SetChild(box);
        box.append($(`<h2>Message Sequence</h2>`)[0]);
        const list = SearchableList<Message>(this.model.messages, (message, index) =>
        {
            const div = Create('div');
            const card = MessageCard(
                message.strings[0],
                message.senderType,
                message.contentType,
                () => { this.ApplyModifications(); EditorManager.Open(new MessageEditor(message, this.RefreshDisplay.bind(this))); },
                MoreMenuArrayFunctions(this, this.model.messages, index, div, ClipData.Message)
            );
            div.append(card);
            return div;
        }, () => new Message(SenderType.User, ContentType.Speech, ["<>"], []));
        box.append(list);

        box = this.NewBox();
        box.append($('<h3>Switch to Activity upon Starting Exchange<h3>')[0]);
        box.append($(`<input placeholder="Activity Name"class="editor-input" value=${this.model.switchToActivity}>`).on('change', (e: any) =>
        {
            this.model.switchToActivity = e.target.value;
            this.RefreshDisplay();
        })[0]);

        box = this.NewBox();
        box.append($('<h3>Followup Dialogue Options<h3>')[0]);
        const diaList = SearchableList(this.model.dialogueChoices, (dia, index) =>
        {
            const div = Create('div');
            const card = DialogueCard(dia,
                () => { this.ApplyModifications(); EditorManager.Open(new DialogueEditor(dia, this.RefreshDisplay.bind(this))); },
                MoreMenuArrayFunctions(this, this.model.dialogueChoices, index, div, ClipData.Dialogue),
            );
            div.append(card);
            return div;
        }, () => new Dialogue("", new Message(0, 0, ["<>"], []), []));
        box.append(diaList);
    }
}