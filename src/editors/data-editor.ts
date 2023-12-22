class DataEditor extends Editor
{
    model: {
        Activities: Activity[],

        botName: string,
        userPfp: string,
        userColor: string,
        botColor: string,
        actionColor: string,

        pronouns: { sub: string, obj: string, pos: string },
        userNicknames: string[],
        botNicknames: string[],
        nicknamesEnabled: boolean,

        awayMessages: Exchange[];
        awayThreshhold: number;
    };
    constructor()
    {
        super();
        this.SetTitle("Data");
        this.model = {
            Activities: $.extend(true, [], Data.Activities),

            botName: Data.botName,
            userPfp: Data.userPfp,
            userColor: Data.userColor,
            botColor: Data.botColor,
            actionColor: Data.actionColor,

            pronouns: Clone(Data.pronouns),
            userNicknames: Clone(Data.userNicknames),
            botNicknames: Clone(Data.botNicknames),
            nicknamesEnabled: Data.nicknamesEnabled,
            awayMessages: Clone(Data.awayMessages),
            awayThreshhold: Data.awayThreshhold
        }
        this.RefreshDisplay();

    }
    public RefreshDisplay()
    {
        let box: HTMLElement;
        box = this.NewBox();
        this.SetChild(box);


        box.append($(`<h3>Activities<h3>`)[0]);
        box.append(SearchableList(this.model.Activities, (ac, index) =>
        {
            const ct = ac.name == Activity.Current?.name ? ContentType.Speech : ContentType.Action;
            const card = MessageCard(ac.name, SenderType.User, ct, () =>
            {
                this.ApplyModifications();
                EditorManager.Open(new ActivityEditor(ac, this.RefreshDisplay.bind(this)));
            },
                [
                    {
                        name: "Set",
                        color: "yellow",
                        function: () =>
                        {
                            this.ApplyModifications();
                            Activity.SetCurrent(ac);
                            this.Close();
                        }
                    },
                    {

                        name: "Clone",
                        function: () =>
                        {
                            this.model.Activities.CloneElement(index);
                            if (this.model.Activities[index + 1].name == "Default") { this.model.Activities[index + 1].name = "<>"; }
                            this.RefreshDisplay();
                        }
                    },
                    (index > 0) ? {
                        name: "Delete",
                        color: "red",
                        function: () =>
                        {
                            this.model.Activities = this.model.Activities.filter(a => a != ac);
                            card.remove();
                        }
                    } : null
                ]);

            return card;
        }, () =>
        {
            const newAC = new Activity("<>", []);
            this.model.Activities.push(newAC);
            return newAC;
        }));

        box = this.NewBox();
        box.append($(`<h5>User Profile Picture</h5>`)[0]);
        box.append(ImageCard(this.model.userPfp, () =>
        {
            //edit screen
            EditorManager.Open(new ImagePicker([Files.ProfilePicturesCategory], (src) =>
            {
                this.model.userPfp = src;
                this.RefreshDisplay();
            }))
        }, null));

        box = this.NewBox();
        box.append($(`<h3>Colors</h3>`)[0]);
        box.append($('<h5>User<h5>')[0]);
        box.append(ColorPicker(this.model.userColor, (target) =>
        {
            this.model.userColor = target.value;

        }));
        box.append($(`<h5>${this.model.botName}<h5>`)[0]);
        box.append(ColorPicker(this.model.botColor, (target) =>
        {
            this.model.botColor = target.value;
        }));
        box.append($('<h5>Action Cards<h5>')[0]);
        box.append(ColorPicker(this.model.actionColor, (target) =>
        {
            this.model.actionColor = target.value;
        }));

        box = this.NewBox();
        box.append($(`<h3>Character's Name<h3>`)[0]);
        box.append(StringCard(this.model.botName, (target) =>
        {
            if (target.value == "") { target.value = "<>"; this.model.botName = "<>"; }
            else { this.model.botName = target.value; }
            this.RefreshDisplay();
        }, null));

        box = this.NewBox();
        box.append($(`<h3>Away Messages<h3>`)[0]);
        box.append($(`<h5>When restarting the app after a while, define messages that are sent as you return.</h5><br/><br/>`)[0]);
        box.append(SearchableList(this.model.awayMessages, (exc, index) =>
        {
            const msg = exc?.messages[0];
            const div = Create('div');
            const card = MessageCard(
                msg?.strings[0],
                msg?.senderType,
                msg?.contentType,
                () =>
                {
                    this.ApplyModifications();
                    const editor = new ExchangeEditor(exc, this.RefreshDisplay.bind(this));
                    EditorManager.Open(editor);
                    if (exc.messages[0]?.strings[0] == "<>")
                        EditorManager.Open(new MessageEditor(exc.messages[0], editor.RefreshDisplay.bind(editor)));
                }, MoreMenuArrayFunctions(this, this.model.awayMessages, index, div, ClipData.Exchange));
            div.append(card);
            return card;
        },
            () => new Exchange([new Message(SenderType.Bot, ContentType.Speech, ["<>"])], [], ""),
            (exc) => JSON.stringify(exc),
            [{
                name: "Clear",
                color: "red",
                function: () => { this.model.awayMessages = []; this.RefreshDisplay(); }
            }]));
        box.append($(`<h5>Number of hours threshhold</h5><br/><br/>`)[0]);
        box.append($(`<input class="editor-input-short" type="number" value="${this.model.awayThreshhold}">`).on('change', (e: any) =>
        {
            this.model.awayThreshhold = parseFloat(e.target.value);
            if (this.model.awayThreshhold < 0) this.model.awayThreshhold = 0;
            e.target.value = this.model.awayThreshhold;
        })[0]);


        box = this.NewBox();
        box.append($(`<h3>Pronouns<h3>`)[0]);
        box.append($(`<h5>Use <span style="color:darkgoldenrod;">{sub}</span>, <span style="color:darkgoldenrod;">{obj}</span>, and <span style="color:darkgoldenrod;">{pos}</span> to insert into action messages. Will occasionally be replaced by ${this.model.botName}'s name to sound more natural. One per action message is generally enough.</h5><br/><br/>`)[0]);
        box.append($(`<h5>Subjective</h5>`)[0]);
        box.append(StringCard(this.model.pronouns.sub, (target) =>
        {
            this.model.pronouns.sub = target.value;
        }));
        box.append($(`<h5>Objective</h5>`)[0]);
        box.append(StringCard(this.model.pronouns.obj, (target) =>
        {
            this.model.pronouns.obj = target.value;
        }));
        box.append($(`<h5>Possessive</h5>`)[0]);
        box.append(StringCard(this.model.pronouns.pos, (target) =>
        {
            this.model.pronouns.pos = target.value;
        }));


        box = this.NewBox();
        box.append($(`<h3>Nicknames<h3>`)[0]);
        box.append(RadioPicker("nicknames-enabled", [
            {
                label: "Disabled",
                function: () => { this.model.nicknamesEnabled = false; },
                active: this.model.nicknamesEnabled == false
            }, {
                label: "Enabled",
                function: () => { this.model.nicknamesEnabled = true; },
                active: this.model.nicknamesEnabled
            }
        ]));
        box.append($(`<h5>For User</h5>`)[0]);
        const userNamesList = SearchableList(this.model.userNicknames, (str, index, addFunction) =>
        {
            const div = Create('div');
            const stringCard = StringCard(str, (target: HTMLInputElement) =>
            {
                if (target.value == "") { target.value = "<>"; this.model.userNicknames[index] = "<>"; }
                else { this.model.userNicknames[index] = target.value; }
            }, addFunction,
                MoreMenuArrayFunctions(this, this.model.userNicknames, index, div, ClipData.String));
            div.appendChild(stringCard);
            return div;
        }, () => "<>");
        box.append(userNamesList);

        box.append($(`<h5>For ${this.model.botName}</h5>`)[0]);
        const botNamesList = SearchableList(this.model.botNicknames, (str: string, index: number, addFunction) =>
        {
            const div = Create('div');
            const stringCard = StringCard(
                str,
                (target: HTMLInputElement) =>
                {
                    if (target.value == "") { target.value = "<>"; this.model.botNicknames[index] = "<>"; }
                    else { this.model.botNicknames[index] = target.value; }
                },
                addFunction,
                MoreMenuArrayFunctions(this, this.model.botNicknames, index, div, ClipData.String)
            );
            div.append(stringCard);
            return div;
        }, () => "<>");
        box.append(botNamesList);


        box = this.NewBox();
        box.append($(`<h3>Data</h3>`)[0]);
        box.append($(`<h5>Chat Cleanup</h5>`)[0]);
        box.append($(`<button class="editor-button">Clear chat history</button>`).on('click', (e) =>
        {
            this.ApplyModifications();
            this.Close();
            Chat.Clear();
            Data.Save();
        })[0]);
        box.append($(`<h5>Save</h5>`)[0]);
        box.append($(`<button class="editor-button">Copy app data to clipboard</button>`).on('click', (e) =>
        {
            this.ApplyModifications();
            Data.Save(() =>
            {
                Data.GetData(data =>
                {
                    navigator.clipboard.writeText(data);
                    e.target.innerText = "Copied!";
                });
            });
        })[0]);

        box.append($(`<h5>Load</h5>`)[0]);
        const dataInp = $(`<textarea class="editor-input" rows="3" placeholder = "Paste JSON save data here...">`)[0] as HTMLInputElement;
        box.append(dataInp);
        const dataLoadBtn = $(`<button class="editor-input">Load</button>`).on('click', () =>
        {
            Data.LoadJSON(dataInp.value);
            this.Close();
        })[0];
        box.append(dataLoadBtn);
        box.append($(`<h5>Delete</h5>`)[0]);
        box.append($(`<button class="editor-button">DELETE ALL DATA</button>`).on('click', (e) =>
        {
            Data.DeleteAllData();
            //kaboom
        })[0]);
    }

    ApplyModifications(): void
    {
        Data.Activities = this.model.Activities;

        Data.botName = this.model.botName;
        Data.userPfp = this.model.userPfp;
        Data.userColor = this.model.userColor;
        Data.botColor = this.model.botColor;
        Data.actionColor = this.model.actionColor;

        Data.userNicknames = this.model.userNicknames;
        Data.botNicknames = this.model.botNicknames;
        Data.pronouns = this.model.pronouns;
        Data.nicknamesEnabled = this.model.nicknamesEnabled;

        Data.awayMessages = this.model.awayMessages;
        Data.awayThreshhold = this.model.awayThreshhold;

        Data.UpdateColors();
    }
}

function MoreMenuArrayFunctions<T>(editor: Editor, array: T[], index: number, card: HTMLElement, clipboardType: ClipData, uniqueFunctions?: MoreMenuFunction[]): MoreMenuFunction[]
{
    const functions = [
        {
            name: "Copy",
            function: () => { Data.clipboard = { type: clipboardType, value: Clone<T>(array[index]) }; editor.RefreshDisplay(); }
        },
        Data.clipboard.type == clipboardType ? {
            name: "Paste",
            function: () => { array[index] = Clone<T>(Data.clipboard.value);; editor.RefreshDisplay(); }
        } : null,

        {
            name: "Clone",
            function: () => { array.CloneElement(index); editor.RefreshDisplay(); }
        },
        {
            name: "Delete",
            color: "red",
            function: () => { array.splice(index, 1); card.remove(); }
        }];
    if (uniqueFunctions)
    {
        return uniqueFunctions.concat(functions);
    }
    return functions;
}