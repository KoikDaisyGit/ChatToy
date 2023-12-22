class Files
{
    private static categories: string[] = [];
    private static files: { category: string, file: File, url?: string }[] = [];
    // private static jsFiles: ChFileList[] = [];
    // private static backgrounds: ChFileList;
    // private static profilePics: ChFileList;

    public static AddCategory(name: string)
    {
        if (this.categories.every(c => c != name))
        {
            this.categories.push(name);
        }
    }

    public static RemoveCategory(name: string)
    {
        this.categories = this.categories.filter(c => c != name);
        this.files = this.files.filter(f => f.category != name);
    }

    // public static SetFiles(jsFiles: ChFileList[], backgrounds: ChFileList, profilePics: ChFileList)
    // {
    //     Files.jsFiles = jsFiles;
    //     // Files.backgrounds = backgrounds;
    //     // Files.profilePics = profilePics;
    // }

    public static AddInitialFiles()
    {
        this.files.push({ file: new File([], "Kiki.png"), category: this.ProfilePicturesCategory, url: "assets/Kiki.png" });
        this.files.push({ file: new File([], "bg-1.png"), category: this.BackgroundCategory, url: "assets/bg-1.png" });
        this.files.push({ file: new File([], "bg-2.png"), category: this.BackgroundCategory, url: "assets/bg-2.png" });
    }

    public static AddFile(file: { file: File, category: string, url?: string })
    {
        if (!file.url || file.url.Contains("blob")) { file.url = URL.createObjectURL(file.file); }
        this.files = this.files.filter(e => e.file.name != file.file.name);
        this.files.push(file);
        if (!this.categories.Contains(file.category)) this.categories.push(file.category);
    }

    public static RemoveFile(fileName: string)
    {
        this.files = this.files.filter(e => e.file.name != fileName);
    }

    public static GetFile(fileName: string): { category: string, file: File, url?: string }
    {
        let file: { category: string, file: File, url?: string } = undefined;
        this.files.forEach(e =>
        {
            if (e.file.name == fileName) file = e;
        })

        return file;
    }

    // public static GetURL(fileName: string): string
    // {
    //     this.files.forEach(e =>
    //     {
    //         if (e.file.name == fileName) fileName = e.url;
    //     });
    //     return fileName;
    // }

    public static GetArtCategories(): string[]
    {
        return this.categories.filter(c => c != this.ProfilePicturesCategory && c != this.BackgroundCategory);
    }

    public static get BackgroundCategory(): string { return "Backgrounds"; };
    public static get ProfilePicturesCategory(): string { return "ProfilePics"; };
    // public static get JSFiles(): ChFileList[] { return Files.jsFiles; };
    public static get Categories(): string[] { return this.categories; };
    public static get Files(): { category: string, file: File, url?: string }[] { return this.files };

}
// class LoadedFile
// {
//     category: string;
//     file: File;
//     url?: string;
//     keepURL?: boolean;
// }
class ChFileList
{
    displayName: string;
    fileNames: string[];
    files: File[];
}
