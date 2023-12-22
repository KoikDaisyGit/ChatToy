function TutorialDialogue(): Dialogue
{
    return new Dialogue("Hello",
        new Message(SenderType.User, ContentType.Speech, ["Hello."], []), [
        new Exchange([
            new Message(SenderType.Bot, ContentType.Speech, ["Hi there! I'm Kiki."], []),
            new Message(SenderType.Bot, ContentType.Speech, ["Welcome to this little chat toy."], []),
            new Message(SenderType.Bot, ContentType.Speech, ["Are you familiar with how this works?"], []),
        ],
            [
                new Dialogue("I'm new",
                    new Message(SenderType.User, ContentType.Speech, ["I'm pretty new."], []), [
                    new Exchange([
                        new Message(SenderType.Bot, ContentType.Speech, ["Oh, uh..."], ["😮"]),
                        new Message(SenderType.Bot, ContentType.Speech, ["Well, it looks like-"], []),
                        new Message(SenderType.Bot, ContentType.Action, ["{sub} rifles through her pages, getting noticably uncomfortable."], []),
                        new Message(SenderType.Bot, ContentType.Speech, ["Hold on, hon. We'll get you taken care of."], []),
                        new Message(SenderType.Bot, ContentType.Speech, ["Ah. Here are the instructions I was looking for!"], []),
                        new Message(SenderType.Bot, ContentType.Action, ["A frown appears on {pos} face."], []),
                        new Message(SenderType.Bot, ContentType.Speech, ["Oh. All it says here is that you should open the menu in the top right and explore around a little."], []),
                        new Message(SenderType.Bot, ContentType.Speech, ["Hope you can manage alright! I can't really help you with anything that isn't written in the notes I took."], []),
                    ])
                ]),
                new Dialogue("I don't need help",
                    new Message(SenderType.User, ContentType.Speech, ["I think I know what I'm doing."], []), [
                    new Exchange([
                        new Message(SenderType.Bot, ContentType.Speech, ["Oh, uh..."], ["😮"]),
                        new Message(SenderType.Bot, ContentType.Speech, ["Okay then. I had a tutorial somwhere in here."], []),
                        new Message(SenderType.Bot, ContentType.Action, ["She rifles through her pages, unable to find it."], []),
                        new Message(SenderType.Bot, ContentType.Speech, ["Oh well. Hope you enjoy yourself!"], []),
                    ])
                ]),
            ]
        )
    ]
    )
}