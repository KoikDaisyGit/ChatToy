class ActivityEditor extends Editor
{
    private activity: Activity;
    private model: {
        dialogues: Dialogue[],
        textColor: string,
        backgroundColor: string,

        backgroundURL: string,
        name: string,
        botPfp: string
    } = {
            dialogues: [],
            textColor: "",
            backgroundColor: "",
            backgroundURL: "",
            name: "",
            botPfp: ""
        };
    constructor(activity: Activity, onCloseFunction: Function)
    {
        super(onCloseFunction);


        this.activity = activity;
        this.model = {
            dialogues: $.extend(true, [], this.activity.dialogues),
            textColor: this.activity.textColor,
            backgroundColor: this.activity.backgroundColor,
            backgroundURL: activity.backgroundURL,
            name: activity.name,
            botPfp: activity.botPfp
        }
        this.RefreshDisplay();
    }

    ApplyModifications(): void
    {
        this.activity.dialogues = this.model.dialogues;
        this.activity.name = this.model.name;
        this.activity.textColor = this.model.textColor;
        this.activity.backgroundColor = this.model.backgroundColor;
        if (Activity.Current == this.activity) { Activity.SetCurrent(this.activity); }
        this.activity.backgroundURL = this.model.backgroundURL;
        this.activity.botPfp = this.model.botPfp;

        if (this.activity.name == Activity.Current?.name || !Activity.Current) { Activity.SetCurrent(this.activity); }

    }
    RefreshDisplay()
    {
        this.SetTitle(this.model.name);

        let box = this.NewBox();
        this.SetChild(box);

        if (this.activity.name != "Default")
        {
            box.append($('<h3>Activity Name<h3>')[0]);

            const titleInput = StringCard(this.model.name, (target) =>
            {
                if (target.value == "" || target.value == "Default") { target.value = "<>"; this.model.name = "<>"; }
                else { this.model.name = target.value; }
            }, null)
            box.append(titleInput);
            box = this.NewBox();
        }
        box.append($('<h3>Dialogue Options<h3>')[0]);
        box.append(SearchableList(
            this.model.dialogues,
            (dia, index) =>
            {
                const div = Create('div');
                const card = DialogueCard(dia,
                    () => { this.ApplyModifications(); EditorManager.Open(new DialogueEditor(dia, this.RefreshDisplay.bind(this))); },
                    MoreMenuArrayFunctions(this, this.model.dialogues, index, div, ClipData.Dialogue));
                div.append(card);
                return div;
            },
            () => new Dialogue("", new Message(0, 0, ["<>"], []), []),
            (dia) => JSON.stringify(dia),
            [{
                name: "Clear",
                color: "red",
                function: () => { this.model.dialogues = []; this.RefreshDisplay(); }
            }]
        ));

        box = this.NewBox();
        box.append($(`<h5>${Data.botName}'s Profile Picture<h5>`)[0]);
        box.append(ImageCard(this.model.botPfp, () =>
        {
            //edit screen
            EditorManager.Open(new ImagePicker([Files.ProfilePicturesCategory], (src) =>
            {
                this.model.botPfp = src;
                this.RefreshDisplay();
            }))
        }, null));

        box = this.NewBox();
        box.append($('<h3>Activity Background<h3>')[0]);
        box.append(ImageCard(this.model.backgroundURL, () =>
        {
            //edit screen
            EditorManager.Open(new ImagePicker([Files.BackgroundCategory], (src) =>
            {
                this.model.backgroundURL = src;
                this.RefreshDisplay();
            }))
        }, null));

        box = this.NewBox();
        box.append($('<h3>Colors<h3>')[0]);

        box.append($('<h5>Normal Text<h5>')[0]);
        box.append(ColorPicker(this.model.textColor, (target) =>
        {
            this.model.textColor = target.value;
        }));
        box.append($('<h5>Background<h5>')[0]);
        box.append(ColorPicker(this.model.backgroundColor, (target) =>
        {
            this.model.backgroundColor = target.value;
        }));

    }
}