
function DialogueCard(dialogue: Dialogue, editAction: Function, menuFunctions?: MoreMenuFunction[]): HTMLElement
{
    const ct = (dialogue.userMessage.contentType == ContentType.Speech) ? ContentType.Speech : ContentType.Action;
    return MessageCard(dialogue.title, dialogue.userMessage.senderType, ct, editAction, menuFunctions);
}