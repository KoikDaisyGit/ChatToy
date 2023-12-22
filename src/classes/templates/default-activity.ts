function DefaultActivity(): Activity
{
    const ac = new Activity("Default", [
        TutorialDialogue()
    ]);
    ac.botPfp = "Kiki.png";
    ac.textColor = "black";
    ac.backgroundColor = "#d9d9d9";
    ac.backgroundURL = "";

    return ac;
}