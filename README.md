# Comment Searcher Extension

A Firefox extension that allows you to search for specific words or phrases in YouTube and Reddit comments with advanced highlighting and navigation features.
(Chrome version is coming soon)

## Extension
```
https://addons.mozilla.org/en-US/firefox/addon/comment-searcher/
```
##  Features

- **Smart Search**: Search for words in any order (loose mode) or exact phrases (strict mode)
- **Real-time Highlighting**: Words are highlighted in yellow for easy identification
- **Auto-Detection**: Automatically searches newly loaded comments when scrolling
- **Navigation**: Jump between matches with Previous/Next buttons

##  Supported Platforms

- **YouTube**: All comment types including replies
- **Reddit**: Comments and nested comment threads


##  How to Use

### Basic Search

1. **Navigate** to a YouTube video or Reddit post with comments
2. **Click the extension icon** in your browser toolbar
3. **Enter your search term** in the input field
4. **Choose search mode**:
   -  Unchecked (default): Words can appear in any order
   -  Checked: Search for exact phrase match
5. **Click "Search"** to highlight matching comments

### Navigation

- **Next Button**: Jump to the next matching comment
- **Previous Button**: Jump to the previous matching comment
- **Auto-scroll**: Extension automatically scrolls to show current match

### Advanced Features

- **Auto-detection**: New comments loaded while scrolling are automatically searched
- **Page isolation**: Each page/video has independent search sessions
- **Visual indicators**: Current match highlighted with red outline

##  Search Modes

### Loose Mode (Default)

- Searches for **all words** anywhere in comments
- Words can appear in **any order**
- Example: Searching "great video" will match:
  - "This video is great!"
  - "Great content in this video"
  - "Video quality is great"

### Strict Mode

- Searches for **exact phrase** match
- Words must appear in **exact order**
- Example: Searching "great video" will only match:
  - "This is a great video"
  - "What a great video!"

##  File Structure

```
commentExtension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.js             # Popup functionality
├── content.js           # Main search and highlighting logic
├── searchicon.png       # Extension icon 
└── README.md            # This file
```







