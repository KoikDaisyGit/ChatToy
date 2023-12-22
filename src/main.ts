//possible name for program "ChatToy: A Client-side dialogue program"
//sliders for text speed of actions/speech. 100 = 10ms, 1 = 100ms, passed into t.js functions

enum SenderType
{
    User,
    Bot
}
enum ContentType
{
    Speech,
    Action,
    Image
}

function Create(tag: string, className?: string, parent?: HTMLElement): HTMLElement
{
    const element = document.createElement(tag);
    if (className)
        element.className = className;
    if (parent) parent.appendChild(element);
    return element;
}


const mainInput = document.getElementById("input-main") as HTMLInputElement;
mainInput?.addEventListener('keyup', (e: any) =>
{
    if (e.currentTarget?.value == "")
    {
        Chat.SetSuggestions([]);
        return;
    }
    let newSuggestions = Activity.Current?.dialogues?.filter(element =>
    {
        return element.title.ToSearchTerm().Contains(e.currentTarget?.value?.ToSearchTerm());
    });
    //master default activity
    if (Activity.Current?.name != Data.Activities[0].name)
    {
        newSuggestions = newSuggestions.concat(Data.Activities[0].dialogues.filter(d =>
        {
            return d.title.ToSearchTerm().Contains(e.currentTarget?.value?.ToSearchTerm());
        }));
    }

    if (newSuggestions)
        Chat.SetSuggestions(newSuggestions.SortByTitleLength());

});
mainInput?.addEventListener('keyup', (e: any) =>
{
    if (e.key == "Enter")
    {
        if (Chat.currentSuggestions.length > 0)
        {
            Chat.PlayDialogue(Chat.currentSuggestions[0]);
        }
        else if (Chat.previousDialogue && Chat.dialogueQueue.length == 0)
        {
            Chat.PlayDialogue(Chat.previousDialogue);
        }
    }
})

Data.Load();



$(`#chat-menu-button`).on('click', () =>
{
    EditorManager.Open(new DataEditor());
})
$(`#image-menu-button`).on('click', () =>
{
    EditorManager.Open(new ImagePicker(Files.GetArtCategories(), (src) =>
    {
        Chat.SendString(SenderType.User, ContentType.Image, Data.userPfp, src);
    }));
});
function GetStorageSize()
{
    var _lsTotal = 0, _xLen, _x; for (_x in localStorage) { if (!localStorage.hasOwnProperty(_x)) { continue; } _xLen = ((localStorage[_x].length + _x.length) * 2); _lsTotal += _xLen; console.log(_x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB") }; console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");
}
GetStorageSize();