class MessageEditor extends Editor
{
    constructor(message: Message, onCloseAction: Function)
    {
        super(onCloseAction);
        this.SetTitle("Message");
        this.message = message;
        this.model = {
            strings: $.extend(true, [], message.strings),
            contentType: message.contentType,
            senderType: message.senderType,
            emoji: $.extend(true, [], message.emoji)
        };
        this.RefreshDisplay();
    }
    ApplyModifications(): void
    {
        if (this.model.contentType != ContentType.Speech) this.model.emoji = undefined;
        this.model.strings = this.model.strings.filter(s => (s != ""));
        this.message.strings = this.model.strings;
        this.message.senderType = this.model.senderType;
        this.message.contentType = this.model.contentType;
        this.message.emoji = this.model.emoji;
    }
    RefreshDisplay(): void
    {
        let box = this.NewBox();
        this.SetChild(box);

        $(box).append(`<h3>Sender<h3>`);
        const speakerRadio = RadioPicker("sender-type", [
            {
                label: "User",
                active: (this.model.senderType == SenderType.User),
                function: () => { this.model.senderType = SenderType.User; this.RefreshDisplay(); }
            },
            {
                label: Data.botName,
                active: (this.model.senderType == SenderType.Bot),
                function: () => { this.model.senderType = SenderType.Bot; this.RefreshDisplay(); }
            },

        ]);
        box.appendChild(speakerRadio);

        $(box).append(`<h3>Content Type<h3>`);
        const contentTypeRadio = RadioPicker("content-type", [
            {
                label: "Speech",
                active: (this.model.contentType == ContentType.Speech),
                function: () => { this.model.contentType = ContentType.Speech; this.RefreshDisplay(); }
            },
            {
                label: "Action",
                active: (this.model.contentType == ContentType.Action),
                function: () => { this.model.contentType = ContentType.Action; this.RefreshDisplay(); }
            },
            {
                label: "Image",
                active: (this.model.contentType == ContentType.Image),
                function: () => { this.model.contentType = ContentType.Image; this.RefreshDisplay(); }
            },
        ]);
        box.appendChild(contentTypeRadio);

        box = this.NewBox();
        $(box).append(`<h3>Variations<h3>`);

        if (this.model.contentType == ContentType.Action)
        {
            const flex = Create('div', 'flex-box', box);
            flex.append($('<button class="editor-button">{sub}</button>').on('click', () =>
            {
                if (this.model.strings[this.model.strings.length - 1] == "<>") this.model.strings[this.model.strings.length - 1] = "";
                this.model.strings[this.model.strings.length - 1] += "{sub} ";
                this.RefreshDisplay();
            })[0]);
            flex.append($('<button class="editor-button">{obj}</button>').on('click', () =>
            {
                if (this.model.strings[this.model.strings.length - 1] == "<>") this.model.strings[this.model.strings.length - 1] = "";
                this.model.strings[this.model.strings.length - 1] += "{obj} ";
                this.RefreshDisplay();
            })[0]);
            flex.append($('<button class="editor-button">{pos}</button>').on('click', () =>
            {
                if (this.model.strings[this.model.strings.length - 1] == "<>") this.model.strings[this.model.strings.length - 1] = "";
                this.model.strings[this.model.strings.length - 1] += "{pos} ";
                this.RefreshDisplay();
            })[0]);
        }
        if (this.model.contentType != ContentType.Image)
        {
            const speechList = SearchableList(this.model.strings, (str, index, addFunction) =>
            {
                const div = Create('div');
                const stringCard = StringCard(str, (target: HTMLInputElement) =>
                {
                    if (target.value == "" || target.value == "\n") { target.value = "<>"; this.model.strings[index] = "<>"; }
                    else { this.model.strings[index] = target.value; }
                }, addFunction, MoreMenuArrayFunctions(this, this.model.strings, index, div, ClipData.String), true, true);
                div.append(stringCard);
                return div;
            }, () => "<>");
            box.appendChild(speechList);

            if (this.model.contentType == ContentType.Speech)
            {
                box = this.NewBox();
                $(box).append(`<h3>Emoji</h3>`);
                box.appendChild(SearchableList(this.model.emoji, (str, index, addFunction) =>
                {
                    const div = Create('div');
                    const stringCard = StringCard(str, target =>
                    {
                        if (target.value == "") { target.value = "🙂"; this.model.emoji[index] = "🙂"; }
                        else
                        {
                            this.model.emoji[index] = target.value;
                        }
                    }, addFunction, MoreMenuArrayFunctions(this, this.model.emoji, index, div, ClipData.String), true);
                    div.append(stringCard);
                    return div;
                }, () => ""));
            }

            // const emojiList = Create('ul', 'row message-emoji-list editor-ul', div);
        }
        else
        {
            const imgList = SearchableList(this.model.strings, (str, index, a) =>
            {
                const div = Create('div', '');
                const imgCard = ImageCard(str, () =>
                {
                    EditorManager.Open(new ImagePicker(Files.GetArtCategories(), (src) =>
                    {
                        this.model.strings[index] = src;
                        this.RefreshDisplay();
                    }));
                }, MoreMenuArrayFunctions(this, this.model.strings, index, div, ClipData.String));
                div.append(imgCard);
                return div;
            }, () => "<>");
            box.appendChild(imgList);
        }

    }
    private model: { strings: string[], contentType: ContentType, senderType: SenderType, emoji: string[] };
    private message: Message;
}

//create binds between current and the html stuff
//ensure emojis are 1 character
//save upon exiting editor