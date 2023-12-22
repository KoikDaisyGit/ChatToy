enum ClipData
{
    Activity,
    Dialogue,
    Exchange,
    Message,
    String,
    Strings
}
class Data
{
    static Activities: Activity[] = [];

    static botName: string = "Kiki";
    static userPfp: string = "";
    static userColor: string = "#0073ff";
    static actionColor: string = "#323f4e";
    static botColor: string = "#ff5e9e";

    static nicknamesEnabled: boolean = false;
    static userNicknames: string[] = [];
    static botNicknames: string[] = [];
    static pronouns: { sub: string, obj: string, pos: string } = { sub: "she", obj: "her", pos: "her" };

    static awayMessages: Exchange[] = [];
    static awayThreshhold: number = 4;
    static previousMessageDate: number = undefined;

    static clipboard: { type: ClipData, value: any } = { type: undefined, value: undefined };

    static readonly dataKey = "ChatAppV2";

    static LoadJSON(data: string)
    {
        function GetValueIfDefined<T>(value: T, defaultValue: T)
        {
            if (value === undefined) return defaultValue;
            else return value;
        }
        if (data)
        {
            try
            {
                data = DataCompression.Decompress(data);
                const JSONData = JSON.parse(data);

                this.Activities = GetValueIfDefined(JSONData.Activities, [DefaultActivity()]);

                this.userPfp = GetValueIfDefined(JSONData.userPfp, this.userPfp);
                this.userColor = GetValueIfDefined(JSONData.userColor, this.userColor);
                this.botColor = GetValueIfDefined(JSONData.botColor, this.botColor);
                this.actionColor = GetValueIfDefined(JSONData.actionColor, this.actionColor);
                this.botName = GetValueIfDefined(JSONData.botName, this.botName);

                this.userNicknames = GetValueIfDefined(JSONData.userNicknames, this.userNicknames);
                this.botNicknames = GetValueIfDefined(JSONData.botNicknames, this.botNicknames);
                this.pronouns = GetValueIfDefined(JSONData.pronouns, this.pronouns);
                this.nicknamesEnabled = GetValueIfDefined(JSONData.nicknamesEnabled, this.nicknamesEnabled);

                this.awayMessages = GetValueIfDefined(JSONData.awayMessages, this.awayMessages);
                this.awayThreshhold = GetValueIfDefined(JSONData.awayThreshhold, this.awayThreshhold);
                this.previousMessageDate = GetValueIfDefined(JSONData.previousMessageDate, this.previousMessageDate);

                Data.UpdateColors();
                Chat.Clear();

                JSONData.MessageHistory?.forEach(item =>
                {
                    Chat.SendString(item.senderType, item.contentType, item.pfp, item.string, item.emoji, null, true);
                });

                if (!Activity.SetCurrentFromName(JSONData.Acurrent))
                {
                    if (this.Activities.length == 0) { this.Activities.push(DefaultActivity()); }
                    Activity.SetCurrent(Data.Activities[0]);
                }

                if (Data.previousMessageDate != undefined)
                {
                    const hours = Hours(Date.now() - Data.previousMessageDate);
                    if (hours > Data.awayThreshhold)
                    {
                        Chat.SendReturnMessage();
                    }
                }

                setTimeout(() => { window.scrollTo(0, 9999) }, 50);

            } catch (err) { console.error(err); }
        } else
        {
            this.Activities = [DefaultActivity()];
            Activity.SetCurrent(Data.Activities[0]);
            Chat.Clear();
            Chat.SendString(SenderType.Bot, ContentType.Action, "", `Welcome. To begin, try typing "hello" in the little cloud box, and click the first option that pops up.`);
        }
    }
    static GetData(callback: (data: string) => void)
    {
        if (('indexedDB' in window))
        {
            let result: string;
            const openRequest = indexedDB.open(this.dataKey);
            openRequest.onupgradeneeded = function ()
            {
                Data.OpenOrGetStore(openRequest, Data.dataKey);
                Data.OpenOrGetStore(openRequest, "Files");
                Files.AddInitialFiles();
                result = Data.GetLocalStorage();
            }
            openRequest.onsuccess = function ()
            {
                const mainTransaction = openRequest.result.transaction(Data.dataKey, "readonly");
                const store = mainTransaction.objectStore(Data.dataKey);
                const getKeyReq = store.get(Data.dataKey);

                getKeyReq.onsuccess = function ()
                {
                    result = getKeyReq.result;
                    console.log("IndexedDB data successfully fetched.");
                }
                getKeyReq.onerror = () =>
                {
                    console.error(getKeyReq.error);
                    result = Data.GetLocalStorage();
                    mainTransaction.commit();
                }
                mainTransaction.oncomplete = () =>
                {
                    const getFilesTransaction = mainTransaction.db.transaction("Files", "readonly");
                    const getFilesReq = getFilesTransaction.objectStore("Files").get("Files");
                    getFilesReq.onsuccess = () =>
                    {
                        if (Array.isArray(getFilesReq.result))
                            getFilesReq.result.forEach(f =>
                            {
                                Files.AddFile({ file: f.file, category: f.category, url: f.url });
                            });
                    }
                    getFilesTransaction.oncomplete = () =>
                    {
                        callback(result);
                    }
                }

            }
        } else
        {
            console.warn("IndexedDB not found. Using LocalStorage, which has a smaller size limit.");
            callback(this.GetLocalStorage());
        }
    }
    static GetLocalStorage() { return localStorage.getItem(Data.dataKey); }
    static Load()
    {
        this.GetData((data) => { Data.LoadJSON(data); });
    }
    static Save(callback?: Function)
    {
        let data = JSON.stringify({
            MessageHistory: Chat.MessageHistory,

            Activities: this.Activities,
            Acurrent: Activity.Current?.name,

            botName: this.botName,
            userPfp: this.userPfp,
            userColor: this.userColor,
            botColor: this.botColor,
            actionColor: this.actionColor,

            pronouns: this.pronouns,
            userNicknames: this.userNicknames,
            botNicknames: this.botNicknames,
            nicknamesEnabled: this.nicknamesEnabled,

            awayMessages: this.awayMessages,
            awayThreshhold: this.awayThreshhold,
            previousMessageDate: this.previousMessageDate
        });
        data = DataCompression.Compress(data);
        if (('indexedDB' in window))
        {
            const openRequest = indexedDB.open(Data.dataKey);
            openRequest.onupgradeneeded = function ()
            {
                Data.OpenOrGetStore(openRequest, Data.dataKey);
                Data.OpenOrGetStore(openRequest, "Files");
            }
            openRequest.onsuccess = function ()
            {
                const db = openRequest.result;
                db.onerror = function (e: any)
                {
                    console.error(e.target.error);
                }
                const transaction = db.transaction(Data.dataKey, "readwrite");
                const store = transaction.objectStore(Data.dataKey);
                Data.SaveDataTransaction(store, Data.dataKey, data, (req) =>
                {
                    req.onsuccess = () =>
                    {
                        if (callback)
                            callback();
                    }
                    req.onerror = () =>
                    {
                        console.error(req.error);
                        if (callback)
                            callback();
                    }
                });
                const fileTransaction = db.transaction("Files", "readwrite");
                const fileStore = fileTransaction.objectStore("Files");
                Data.SaveDataTransaction(fileStore, "Files", Files.Files, (req) =>
                {
                    req.onerror = () => { console.log(req.error); }
                });
            };
            openRequest.onerror = function (e: any)
            {
                console.error(e.target.error);
            }
        } else
        {
            localStorage.setItem(this.dataKey, data);
            if (callback)
                callback();
        }


    }
    static DeleteAllData()
    {
        const deleteRequest = indexedDB.deleteDatabase(Data.dataKey);
        deleteRequest.onupgradeneeded = () =>
        {
            console.log("upgrade!");
            console.log(deleteRequest.result);
            window.location.reload();
        }
        deleteRequest.onsuccess = () =>
        {
            console.log("success!");
            console.log(deleteRequest.result);
            window.location.reload();
        }
        deleteRequest.onerror = () =>
        {
            console.log("failure!");
            console.error(deleteRequest.error);
            window.location.reload();
        }
        deleteRequest.onblocked = () =>
        {
            window.location.reload();
        }
    }
    static UpdateColors()
    {
        $(':root')[0].style.setProperty("--color-user", this.userColor);
        $(':root')[0].style.setProperty("--color-bot", this.botColor);
        $(':root')[0].style.setProperty("--color-action-suggestion", this.actionColor);
    }
    static SaveDataTransaction(store: IDBObjectStore, key: string, data: any, callback?: (req: IDBRequest) => void)
    {
        const getKeyReq = store.getKey(key);
        getKeyReq.onsuccess = function ()
        {
            const req = store.put(data, key);
            if (callback)
                callback(req);
        }
        getKeyReq.onerror = function ()
        {
            const req = store.add(data, key);
            if (callback)
                callback(req);
        }

    }
    static OpenOrGetStore(openRequest: IDBOpenDBRequest, name: string): IDBObjectStore
    {
        const db = openRequest.result;
        db.onerror = function (e: any)
        {
            console.error(e.target.error);
        }

        if (!db.objectStoreNames.contains(name) && !openRequest.transaction.objectStoreNames.contains(name))
            return db.createObjectStore(name);
        else
            return openRequest.transaction.objectStore(name);

    }
}

function Hours(milliseconds: number): number { return milliseconds / 1000 / 60 / 60; }