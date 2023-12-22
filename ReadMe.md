# ChatToy ReadMe
<img alt="01" src="https://github.com/KoikDaisyGit/ChatToy/assets/114887027/19437612-acbe-4e5e-930e-a1ba1b3dad61" width="200" />
<img alt="01" src="https://github.com/KoikDaisyGit/ChatToy/assets/114887027/9f812775-a3bc-444f-9554-238ae8c90c80" width="200" />
<img alt="01" src="https://github.com/KoikDaisyGit/ChatToy/assets/114887027/bcb67b21-68e9-4b8f-804d-4808ba666d56" width="200" />

### What is ChatToy?
ChatToy is a fully offline HTML-based dialogue system made for the fun of chatting with fictional characters of one's creation. All dialogue is user-defined, allowing full control over the interactions, with a reasonable amount of potential randomness.
The user can define verbal, non-verbal, and image/video responses in any combination to create scenes that play out as they desire.

---

### How to Use ChatToy
In the lower-right corner, there's a main input box which, when typed into, will search for valid Dialogue options and display them to the user. When an option is tapped, the user's avatar will speak the Message defined in the Dialogue, and then a random Exchange from that Dialogue will be selected and spoken in response.

The user can define these options by tapping the menu icon in the upper-right corner and editing the data.

---
### Data Structure
##### Messages
Messages are the basic building blocks of the system. They specify their sender and type. Types include speech, actions, and images. Each Message contains a list of strings or images which are randomly selected between when the Message is sent. 
###### Emoji
If the message is speech, the user can define a list of emojis which will be randomly selected from and placed onto the Message as it's spoken.
###### Pronouns
If the Message is an action, the user can place `{sub}`, `{obj}`, and `{pos}` into the text to act as placeholders for the bot's pronouns, which can be defined in the top level menu. After a certain number of messages, a pronoun will be replaced with the bot's name to create a more natural sounding rhythm to the narration.
###### Random Lists
The user can further randomize Messages by placing options within `[` and `]` separated by `|`. For example, a message might be defined as: `I'd like a [burger|waffle|donut]!` and the system will randomly select and use one of the options within the brackets. This also works for emoji lists.
##### Exchanges
Exchanges are lists of Messages executed in sequence. They represent a scene which plays out in its entirety. They have a "Switch To Activity" field which, when populated, enables the first Activity with a matching name upon starting the Exchange. Exchanges also have their own list of Dialogues, which represent further branching options limited to the context of that Exchange. This allows for very specific conversations to be defined and played out, if the user likes.
###### Away Messages
Away Messages, found in the top level menu, is a list of Exchanges that is randomly selected from when the user reloads the application after a set amount of time.
##### Dialogues
Dialogues represent the many possible sentences or actions the user can say to the bot and contain the bot's responses respective to what is said. They have a title attribute, used for search results, an initial Message, which is what is said upon choosing the Dialogue option, and a list of possible Exchanges, which determine the branching outcomes of the interaction.
##### Activities
Activities determine the context of the conversation. They will define the bot's profile picture, the background image, and which dialogues are displayed when the user types in the main input. Only one activity may be active at a given time.
###### The "Default" Activity
ChatToy has one immutable activity called "Default." Its name cannot be changed, and any Dialogue options defined within will be available regardless of which Activity is active. Think of it as a container of globally-scoped Dialogues.

---

### Exporting/Importing App Data
As a measure for preventing data loss, the user can copy all written app data to their clipboard for preserving elsewhere. It's recommended to save it to a .json file with UTF-8 enabled to preserve emojis. Data can also be imported by pasting it into the Data input and clicking the "Load" button.
### Importing Images
ChatToy allows the user to import images from their device for use with the application. They can create categories and then import images into those categories. These images are identified by file name saved to the browser's database for later use. Images are used for profile pictures, backgrounds, and Message bodies.
##### Chat Image Button
There is an image button in the main chat's lower-left corner which will allow the user to send an image for viewing regardless of context.

---
### Using ChatToy on Android devices
The application can be run locally on Google Chrome for Android by placing its folder in Chrome's download directory: `Android/data/com.android.chrome/files/Download/`
###### Set up Dropbox Connection
One way to place your ChatToy folder into Chrome's download directory is to use Dropbox in tandem with [FolderSync](https://play.google.com/store/apps/details?id=dk.tacit.android.foldersync.lite&hl=en_US&gl=US) for Android devices.
* Place your ChatToy folder somewhere in your Dropbox.
* Open FolderSync on your Android device.
* Link your Dropbox under the Accounts tab (the icon of people).
* Set up a synced folder pair between your Dropbox and your Chrome downloads folder.
	* Go to the Folderpairs tab (folder icon) and tap "Create folderPair." 
	* Set the left folder to: `Android/data/com.android.chrome/files/Download/[name_of_your_folder]` 
		* (You will need to give FolderSync file permissions)
	* Set the right folder to the ChatToy folder you placed in Dropbox.
	* Once finished, tap "Sync." The files in your Dropbox will be copied to your Chrome downloads folder.
##### Set up Shortcut on Home Screen
Since Chrome doesn't allow users to open files easily, [ShortcutMaker](https://play.google.com/store/apps/details?id=rk.android.app.shortcutmaker&hl=en_IE) for Android devices can be used to create a shortcut to open a file.
* Open ShortcutMaker.
* Create a new "Website" shortcut
* Set the shortcut link to: `file:///storage/emulated/0/Android/data/com.android.chrome/files/Download/[name_of_your_folder]/index.html`
* Tap "Place on Home Screen"
* Set up the name and icon however you like.
* Double check and edit the link if it automatically prepends `http://` to the beginning. It must begin with `file:///`
* Disable "Shortcut Fix."
* Tap "Create Shortcut."
* You can edit the icon on the home screen to remove the ShortcutMaker badge if you like.

---

### Extending/Developing ChatToy
This application was developed using TypeScript and CSS compiled, concatenated, and minimized for lightweight offline use. For those wishing to fork or otherwise further develop ChatToy, you need only open a terminal in the folder and run the following commands:
```
npm install
npm run start
```
There are grunt scripts installed that will handle file watching and typescript compilation and cleaning. You can simply open `dist/index.html` after the build succeeds to see your changes. I recommend installing the Live Server plugin for VS Code to make iteration more automatic after changes are made. Just right click `dist/index.html` and click "Open with Live Server."

P.S. Apologies for any disorganization in the code. I've organized as much as felt necessary and expedient.
