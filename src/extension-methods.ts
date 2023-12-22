interface String
{
    Contains(string: string): boolean;
    PickChar(this: string): string;
    ReplaceAll(this: string, string: string, replacement: string): string;
    LastChar(this: string): string;
    Capitalize(this: string): string;
    Count(this: string, search: string): number;
    ToSearchTerm(this: string): string;
}
String.prototype.Contains = function (string: string): boolean
{
    return this.lastIndexOf(string) != -1;
}
String.prototype.PickChar = function (this: string)
{
    const str = this.toString();
    const i = Math.floor(Math.random() * (str.length - 1));
    return str[i];
}
String.prototype.ReplaceAll = function (string: string, replacement: string): string
{
    if (string == replacement) return string;
    let str: string = this;
    while (str.Contains(string))
    {
        str = str.replace(string, replacement);
    }
    return str;
}
String.prototype.LastChar = function (): string
{
    return this[this.length - 1];
}
String.prototype.Capitalize = function (): string
{
    if (this.length < 2) return this.toUpperCase();
    return this[0].toUpperCase() + this.substring(1, this.length).toLowerCase();
}
String.prototype.Count = function (search: string): number
{
    let start = 0;
    let i = 0;
    while (start > -1)
    {
        start = this.indexOf(search, start);
        if (start > -1) start++;
        if (start >= this.length) start = -1;
        i++;
    }
    return i;
}
String.prototype.ToSearchTerm = function (): string
{
    let punctuation = `.'"?! ,;_-=(){}[]`;
    let str = this.toLowerCase();
    for (let i = 0; i < punctuation.length; i++)
    {
        const char = punctuation[i];
        str = str.ReplaceAll(char, "");
    }
    return str;
}



interface HTMLElement { ClearChildren(): void; }
HTMLElement.prototype.ClearChildren = function (): void
{
    while (this.firstElementChild)
    {
        this.removeChild(this.firstElementChild);
    }
}


interface Array<T>
{
    PickOne(this: T[]): T;
    CloneElement<T extends Object>(this: T[], index: number): void;
    Contains(this: T[], element: T): boolean;
    SortByLength(this: string[]): string[];
    SortByTitleLength(this: Dialogue[]): Dialogue[];
}
Array.prototype.PickOne = function ()
{
    const i = Math.floor(Math.random() * this.length);
    return this[i];
}
Array.prototype.CloneElement = function <T>(this: T[], index: number): void
{
    this.splice(index, 0, Clone(this[index]));
}
Array.prototype.Contains = function <T>(element: T): boolean
{
    return this.some((e: T) => e == element);
}
Array.prototype.SortByLength = function (): string[]
{
    for (let i = 0; i < this.length - 1; i++)
    {
        if (this[i].length > this[i + 1].length)
        {
            const swap = this[i + 1];
            this[i + 1] = this[i];
            this[i] = swap;
            i = 0;
        }
    }
    return this;
}
Array.prototype.SortByTitleLength = function (): Dialogue[]
{
    return this.sort((a, b) => { return a.title.length - b.title.length; });
}


function Clone<T>(object: T): T
{
    if (typeof object == "string") { return object; }
    else if (Array.isArray(object)) { return $.extend(true, [], object); }
    return $.extend(true, {}, object);
}