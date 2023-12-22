function MessageSuggestion(dialogue: Dialogue): HTMLElement
{
    const li = Create('li', 'message message-user');
    const className = (dialogue.userMessage.contentType == ContentType.Speech) ? 'speech-bubble speech-bubble-user' : 'speech-bubble speech-bubble-neutral';
    const button = Create('button', className, li);
    button.innerText = dialogue.title;
    button.addEventListener('click', e =>
    {
        mainInput.focus();
        Chat.PlayDialogue(dialogue);
    })
    return li;
}