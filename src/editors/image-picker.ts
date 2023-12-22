class ImagePicker extends Editor
{
    private onFinish: Function;
    private categories: string[] = [];
    static File: File;
    ApplyModifications(): void
    {

    }
    constructor(categories: string[], onFinish: (src: string) => void)
    {
        super(null, true);
        this.SetTitle("Select Image");
        this.onFinish = onFinish;
        this.categories = categories;
        this.RefreshDisplay();

    }
    RefreshDisplay()
    {
        this.SetChild($(`<button class="editor-button">No Image</button>`).on('click', () =>
        {
            if (this.onFinish) (this.onFinish(""));
            this.Close();
        })[0]);
        this.append($(`<br/>`)[0]);
        this.append($(`<br/>`)[0]);
        if (!(this.categories.Contains(Files.BackgroundCategory) && this.categories.Contains(Files.ProfilePicturesCategory)))
        {
            const addCatInput = Create('input', 'editor-input-short') as HTMLInputElement;
            addCatInput.placeholder = "New Category Name..."
            const addCatBtn = Create('button', 'editor-button');
            addCatBtn.innerText = "Add Category";
            $(addCatBtn).on('click', () =>
            {
                let str = addCatInput.value;
                if (str == "") return;
                if (Files.Categories.Contains(str)) str = str + " (Copy)";
                this.categories.push(str);
                this.RefreshDisplay();
            });
            this.append(addCatInput);
            this.append(addCatBtn);
        }

        this.categories.forEach(category =>
        {
            const div = Create('div', 'image-picker-container');
            div.style.position = "relative";
            const label = $(`<label class="add-button">+</label>`)[0];
            $(label).append($(`<input multiple class="image-file-picker" type="file" accept="image/*,video/*">`).on('change', (e: any) =>
            {
                console.log("filessss");
                console.log(e.target.files[0]);
                const list = e.target.files as File[];
                console.log(list);
                console.log(list.length);
                for (let i = 0; i < list?.length; i++)
                {
                    const f = list[i];
                    const file = f as File;
                    Files.AddFile({ file: file, category: category });
                }
                Data.Save();
                this.RefreshDisplay();

            })[0]);
            div.append($(`<h3>${category}</h3>`)[0]);
            div.append($(`<div class="top-right"></div>`).append(new MoreMenu([{
                name: "Add Media",
                function: () => { label.click(); this.RefreshDisplay(); }
            },
            {
                name: "Delete",
                color: "red",
                function: () => { Files.RemoveCategory(category); this.categories = this.categories.filter(c => c != category); this.RefreshDisplay(); }
            }
            ]).element)[0]);
            div.append($(`<hr />`)[0]);
            const list = Files.Files.filter(f => f.category == category);
            list.forEach((src) =>
            {

                const imgDiv = Create('div', 'picker-image-div', div);
                const divDiv = Create('div', '', imgDiv);
                if (src.file.name.Contains(".mp4"))
                {
                    divDiv.append($(`<video autoplay muted loop class="picker-image" src="${src.url}">`).on('click', () =>
                    {
                        if (this.onFinish) { this.onFinish(src.file.name); }
                        this.Close();
                    })[0]);
                }
                else
                {
                    divDiv.append($(`<img class="picker-image" src="${src.url}">`).on('click', () =>
                    {
                        console.log(src.file.name);
                        if (this.onFinish) { this.onFinish(src.file.name); }
                        this.Close();
                    })[0]);
                }
                divDiv.append($(`<div class="top-right"></div>`).append(new MoreMenu([{
                    name: "Delete",
                    color: "red",
                    function: () => { Files.RemoveFile(src.file.name); this.RefreshDisplay(); }
                }]).element)[0])
            });
            this.append(div);
        });
    }
}