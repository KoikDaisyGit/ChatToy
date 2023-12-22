class Chat
{
    private static readonly chatList = document.getElementById("chat-main");
    private static readonly suggestionList = document.getElementById("suggestions");

    private static messageHistory: any[] = [];
    public static get MessageHistory(): any[] { return this.messageHistory; }



    static SendString(senderType: SenderType, contentType: ContentType, pfp: string, string: string, emoji?: string, finishAction?: Function, disableAnimation?: boolean)
    {
        let element: HTMLElement;
        if (contentType == ContentType.Action || (string.Contains("*") && contentType != ContentType.Image))
        {
            element = ActionMessage(senderType, string.ReplaceAll("*", ""), finishAction, disableAnimation)
        }
        else
        {
            if (senderType == SenderType.User)
            {
                element = UserChatMessage(contentType, string, finishAction, disableAnimation);
            }
            else
            {
                element = BotChatMessage(contentType, pfp, string, finishAction, emoji, disableAnimation);
            }
        }

        this.chatList.appendChild(element);

        window.scrollTo(0, 999999);
        setTimeout(() =>
        {
            window.scrollTo(0, 999999);
        }, 50);

        this.messageHistory.push({
            senderType: senderType,
            contentType: contentType,
            string: string,
            emoji: emoji,
            pfp: pfp
        });

        while (this.chatList.children.length > 100)
        {
            this.chatList.removeChild(this.chatList.firstElementChild);
        }
        while (this.messageHistory.length > 100)
        {
            this.messageHistory.shift();
        }

        Data.Save();
    }



    static SendMessage(message: Message, finishAction?: Function, disableAnimation?: boolean)
    {
        let choice = this.GetUnusedString(message);

        const pfp = (message.senderType == SenderType.User) ? Data.userPfp : Activity.Current.botPfp;
        const string = this.ProcessString(choice, message.senderType, message.contentType);
        const emoji = this.ResolveRandoms(message.emoji?.PickOne());
        const messages = this.SplitActions(string);

        let i = 1;

        Chat.SendString(message.senderType, message.contentType, pfp, messages[0], emoji, Iterate, disableAnimation);

        function Iterate()
        {
            setTimeout(() =>
            {
                if (i < messages.length)
                {
                    Chat.SendString(message.senderType, message.contentType, pfp, messages[i], emoji, () =>
                    {
                        i++;
                        Iterate();
                    }, disableAnimation);
                } else
                {
                    if (finishAction)
                        finishAction();
                }
            }, 1000);

        }

        // this.SendString(message.senderType, message.contentType, pfp, string, emoji, finishAction, disableAnimation);

        Data.previousMessageDate = Date.now();
    }
    static currentSuggestions: Dialogue[] = [];
    static SetSuggestions(dialogues: Dialogue[])
    {
        const added: string[] = [];
        this.suggestionList.ClearChildren();
        this.currentSuggestions = [];
        let count = 0;
        dialogues.forEach(dialogue =>
        {
            const notAdded = (added.length == 0 || added.every(title => title != dialogue.title));
            if (count < 3 && notAdded)
            {
                count++;
                added.push(dialogue.title);
                const s = MessageSuggestion(dialogue);
                this.suggestionList.prepend(s);
                this.currentSuggestions.push(dialogue);
            }
        });
    }

    private static previousExchange: Exchange;
    static backFromLongDeparture: boolean = false;
    static previousDialogue: Dialogue;
    static enabled: boolean = true;
    static dialogueQueue: Dialogue[] = [];
    static PlayDialogue(dialogue: Dialogue)
    {
        if (this.dialogueQueue.length > 3 || !this.enabled) return;
        this.previousDialogue = dialogue;
        this.dialogueQueue.push(dialogue);

        NewBar.Remove();
        mainInput.value = "";

        this.SetSuggestions([]);

        if (this.dialogueQueue.length > 1) return;

        function GetExchange(dialogue: Dialogue): Exchange
        {
            let exchange = dialogue.exchanges.PickOne();
            //ensure the same exchange cannot happen twice in a row
            if (dialogue.exchanges.length > 1 && Chat.previousExchange == exchange)
            {
                //reset recent strings list to save on memory
                Chat.usedStringsCache = [];
                exchange = dialogue.exchanges.filter(ex => Chat.previousExchange != ex).PickOne();
            }
            Chat.previousExchange = exchange;
            return exchange;
        }
        let exchange = GetExchange(dialogue);
        this.SendMessage(dialogue.userMessage, () =>
        {

            let i = 0;
            Iterate();
            function Iterate()
            {
                setTimeout(() =>
                {
                    if (i < exchange?.messages.length)
                    {
                        if (exchange.switchToActivity) Activity.SetCurrentFromName(exchange.switchToActivity);
                        Chat.SendMessage(exchange.messages[i], () =>
                        {

                            i++;
                            Iterate();
                        });
                    } else
                    {
                        Chat.dialogueQueue.shift();
                        if (exchange?.dialoguePaths?.length > 0)
                        {
                            Chat.SetSuggestions(exchange.dialoguePaths);
                            Chat.dialogueQueue = [];
                        }
                        else if (Chat.dialogueQueue.length > 0)
                        {
                            exchange = GetExchange(Chat.dialogueQueue[0]);
                            Chat.SendMessage(Chat.dialogueQueue[0].userMessage, () =>
                            {
                                i = 0;
                                Iterate();
                            });
                        }

                    }

                }, (Math.random() * (500) + 1000));

            }

        });
    }

    static Clear()
    {
        this.messageHistory = [];
        this.chatList.ClearChildren();
    }

    private static usedStringsCache: { message: Message, string: string }[] = [];

    private static GetUnusedString(message: Message): string
    {
        let messageString = message.strings.PickOne();

        function UsedStringRecently(stringToCheck: string): boolean 
        {
            const listHasMembers = Chat.usedStringsCache?.length > 0;
            const listContainsString = !Chat.usedStringsCache.every(r => { return r.string != stringToCheck || r.message != message; });

            return listHasMembers && listContainsString;
        }

        if (message.strings.length > 1)
        {
            if (UsedStringRecently(messageString))
            {
                const newList = message.strings.filter(str => { return str != messageString });
                messageString = newList.PickOne();
            }
            //remove previous entries pertaining to the Message
            this.usedStringsCache = this.usedStringsCache.filter(str => str.message != message);
            //add this entry
            this.usedStringsCache.push({ message: message, string: messageString });
        }
        return messageString;
    }
    private static ProcessString(string: string, senderType: SenderType, contentType: ContentType): string
    {
        string = this.ResolveRandoms(string);
        string = this.AddNicknames(string, senderType, contentType);
        string = this.AddPronouns(string, contentType);
        return string;
    }
    private static AddNicknames(string: string, senderType: SenderType, contentType: ContentType): string
    {
        if (Data.nicknamesEnabled && contentType == ContentType.Speech && Math.random() > 0.75)
        {
            if (senderType == SenderType.User) { string = replaceFirstSentenceEnding(string, Data.botNicknames); }
            else { string = replaceFirstSentenceEnding(string, Data.userNicknames); }
        }
        function replaceFirstSentenceEnding(string: string, names: string[]): string
        {
            for (let i = 0; i < string.length; i++)
            {
                const char = string[i];
                if (".?!".Contains(char))
                {
                    string = string.replace(char, `, ${names?.PickOne() + char}`);
                    break;
                }
            }
            return string;
        }
        return string;
    }
    private static AddPronouns(string: string, contentType: ContentType): string
    {
        if (!string.Contains("{") || !string.Contains("}")) { this.pronounCounter++; return string; }

        if (this.pronounCounter > 4 && Math.random() > 0.75 || this.pronounCounter > 7)
        {
            this.pronounCounter = 0;
            let start = 0;
            let end = 0;
            while (start > -1 && end > -1)
            {
                start = string.indexOf("{", end);
                if (start == -1) continue;

                end = string.indexOf("}", start);
                if (end == -1) continue;

                let success = false;
                const substr = string.substring(start, end);
                switch (substr)
                {
                    case "{sub":
                        string = string.replace("{sub}", Data.botName);
                        success = true;
                        break;
                    case "{pos":
                        string = string.replace("{pos}", (Data.botName.toLowerCase().LastChar() == "s") ? `${Data.botName}'` : `${Data.botName}'s`);
                        success = true;
                        break;
                    case "{obj":
                        string = string.replace("{obj}", Data.botName);
                        success = true;
                        break;
                }
                if (success) break;
            }
        } else
        {
            this.pronounCounter++;
        }
        string = this.ReplacePronoun(string, "{sub}", Data.pronouns.sub);
        string = this.ReplacePronoun(string, "{obj}", Data.pronouns.obj);
        string = this.ReplacePronoun(string, "{pos}", Data.pronouns.pos);

        return string;
    }
    private static ReplacePronoun(string: string, searchString: string, replaceString: string): string
    {
        if (searchString == replaceString) return string;
        while (string.Contains(searchString))
        {
            let replace =
                (this.IsBeginningOfSentence(string, string.indexOf(searchString)))
                    ? replaceString.Capitalize()
                    : replaceString.toLowerCase();
            string = string.replace(searchString, replace);
        }
        return string;
    }
    private static IsBeginningOfSentence(fullString: string, index: number): boolean
    {
        let success = false;
        if (index == 0) return true;
        if (index < 0) return false;
        const endings = [".", "?", "!", "*", "{"];
        endings.forEach(char =>
        {
            let sentenceEnderIndex = fullString.lastIndexOf(char, index);
            let testString = fullString.substring(sentenceEnderIndex, index);
            if (testString.ReplaceAll(" ", "").ReplaceAll("\\n", "") == char) success = true;
        })

        return success;
    }
    private static ResolveRandoms(str: string): string
    {
        if (!str) return str;
        if (!(str.Contains("[") && str.Contains("]"))) return str;
        let start = 0;
        let end = 0;
        while (start > -1 && end > -1)
        {
            start = str.lastIndexOf("[");
            end = str.indexOf("]", start);
            if (end > start)
            {
                let choices = str.substring(start + 1, end);
                const choice = choices.split("|").PickOne();
                str = str.replace(`[${choices}]`, choice);
            }
        }
        return str;
    }
    private static SplitActions(str: string): string[]
    {
        const list = [];

        while (str.Count("*") > 1)
        {
            const start = str.indexOf("*");
            const end = str.indexOf("*", start + 1) + 1;
            if (str.substring(0, start))
                list.push(str.substring(0, start));
            if (str.substring(start, end))
                list.push(str.substring(start, end));
            str = str.substring(end, str.length);
        }
        if (str != "" || list.length == 0) list.push(str);
        return list;
    }
    static SendReturnMessage()
    {

        const ex = Data.awayMessages?.PickOne();
        if (!ex) return;
        mainInput.style.opacity = "50%";
        Chat.enabled = false;
        let i = 1;
        let Iterate = () =>
        {
            setTimeout(() =>
            {
                if (i < ex.messages.length)
                {
                    Chat.SendMessage(ex.messages[i], () =>
                    {
                        i++;
                        Iterate();
                    });

                } else
                {
                    //done
                    if (ex.dialoguePaths.length > 0)
                    {
                        Chat.SetSuggestions(ex.dialoguePaths);
                        this.dialogueQueue = [];
                    }
                    else if (this.dialogueQueue.length > 0)
                    {

                    }
                    mainInput.style.opacity = "unset";
                    Chat.enabled = true;
                }
            }, (Math.random() * (1000) + 1000));
        }
        Chat.backFromLongDeparture = true;
        setTimeout(() =>
        {
            NewBar.Set();


            Activity.SetCurrentFromName(ex?.switchToActivity);
            Chat.SendMessage(ex.messages[0], Iterate);


        }, (Math.random() * (1000) + 2000));
    }


    private static pronounCounter: number = 8;
}