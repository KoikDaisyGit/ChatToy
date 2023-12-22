class DataCompression
{
    static readonly replacements = [
        { str: `"title":`, rpl: `"t":` },
        { str: `"exchanges":`, rpl: `"ex":` },
        { str: `"messages":`, rpl: `"m":` },
        { str: `"pfp":`, rpl: `"p":` },
        { str: `"emoji":`, rpl: `"e":` },
        { str: `"strings":`, rpl: `"s":` },
        { str: `"string":`, rpl: `"sr":` },
        { str: `"contentType":`, rpl: `"c":` },
        { str: `"userMessage":`, rpl: `"u":` },
        { str: `"senderType":`, rpl: `"sT":` },
        { str: `"dialogues":`, rpl: `"d":` },
        { str: `"dialoguePaths":`, rpl: `"dP":` },
        { str: `"backgroundURL":`, rpl: `"b":` },
        { str: `"name":`, rpl: `"n":` },
        { str: `"actionSuggestion":`, rpl: `"a":` },
        { str: `"botPfp":`, rpl: `"bp":` },
        { str: `:"./img/_profile-pics/`, rpl: `:"p/` },
        { str: `:"./img/_backgrounds/`, rpl: `:"b/` },
    ];
    static Compress(str: string): string
    {
        this.replacements.forEach(replacement =>
        {
            str = str.ReplaceAll(replacement.str, replacement.rpl);
        });
        return str;
    }
    static Decompress(str: string): string
    {
        this.replacements.forEach(replacement =>
        {
            str = str.ReplaceAll(replacement.rpl, replacement.str);
        });
        return str;
    }
}