class NewBar
{
    static instance: HTMLElement;
    static Set()
    {
        this.Remove();
        this.instance = $(`<div class="new-bar"/><span>NEW</span><hr/></div>`)[0];
        $('#chat-main').append(this.instance);
    }
    static Remove()
    {
        this.instance?.remove();
    }
}