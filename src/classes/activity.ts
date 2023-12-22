class Activity
{
    private static current: Activity;
    public static get Current(): Activity { return Activity.current; }
    public static SetCurrent(activity: Activity)
    {
        if (!activity) return;

        this.current = activity;

        if (!activity.textColor) activity.textColor = "black";
        if (!activity.backgroundColor) activity.backgroundColor = "#d9d9d9";

        this.SetColors(activity.textColor, activity.backgroundColor);

        if (activity.backgroundURL && activity.backgroundURL != "")
        {
            $(':root')[0].style.setProperty("--url-background", `url(${Files.GetFile(activity.backgroundURL)?.url})`);
        } else
        {
            $(':root')[0].style.setProperty("--url-background", `none`);
            $(':root')[0].style.setProperty("--bg-filter", `none`);
        }
    }
    constructor(name: string, dialogues: Dialogue[])
    {
        this.name = name;
        this.dialogues = dialogues;
    }
    dialogues: Dialogue[] = []
    name: string = "";
    textColor: string = "";
    backgroundColor: string = "";
    botPfp: string = "";
    backgroundURL: string = "";
    static SetColors(textColor: string, backgroundColor: string)
    {
        $(':root')[0].style.setProperty("--color-action-text", textColor);
        $(':root')[0].style.setProperty("--color-background", backgroundColor);
    }
    static SetCurrentFromName(name: string): boolean
    {
        let b = false;
        for (let i = 0; i < Data.Activities.length; i++)
        {
            const ac = Data.Activities[i];
            if (ac.name.toLowerCase() == name?.toLowerCase())
            {
                Activity.SetCurrent(ac);
                b = true;
                break;
            }
        }
        return b;
    }

}




