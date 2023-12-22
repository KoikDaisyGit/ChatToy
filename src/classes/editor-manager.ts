class EditorManager
{
    private static div = document.getElementById("editors-container")
    static Open(editor: Editor)
    {
        editor.AppendTo(this.div);
    }
}