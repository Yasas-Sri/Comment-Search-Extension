# Comment Searcher Extension

A Chrome extension that allows you to search for specific words or phrases in YouTube and Reddit comments with advanced highlighting and navigation features.

## 🚀 Features

- **Smart Search**: Search for words in any order (loose mode) or exact phrases (strict mode)
- **Real-time Highlighting**: Words are highlighted in yellow for easy identification
- **Auto-Detection**: Automatically searches newly loaded comments when scrolling
- **Navigation**: Jump between matches with Previous/Next buttons
- **Multi-Platform**: Works on both YouTube and Reddit
- **Clean Transitions**: Search state clears when navigating to different pages
- **Visual Focus**: Current match is outlined in red for precise navigation

## 📋 Supported Platforms

- **YouTube**: All comment types including replies
- **Reddit**: Comments and nested comment threads

## 🛠️ Installation

### Method 1: Load as Unpacked Extension (Development)

1. **Download or Clone** this repository to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in top-right corner)
4. **Click "Load unpacked"** and select the extension folder
5. **Pin the extension** to your toolbar for easy access

### Method 2: Install from Chrome Web Store (Coming Soon)

_Extension will be available on Chrome Web Store after review_

## 🎯 How to Use

### Basic Search

1. **Navigate** to a YouTube video or Reddit post with comments
2. **Click the extension icon** in your browser toolbar
3. **Enter your search term** in the input field
4. **Choose search mode**:
   - ☐ Unchecked (default): Words can appear in any order
   - ☑️ Checked: Search for exact phrase match
5. **Click "Search"** to highlight matching comments

### Navigation

- **Next Button**: Jump to the next matching comment
- **Previous Button**: Jump to the previous matching comment
- **Auto-scroll**: Extension automatically scrolls to show current match

### Advanced Features

- **Auto-detection**: New comments loaded while scrolling are automatically searched
- **Page isolation**: Each page/video has independent search sessions
- **Visual indicators**: Current match highlighted with red outline

## 🔧 Search Modes

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

## 📁 File Structure

```
commentExtension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.js             # Popup functionality
├── content.js           # Main search and highlighting logic
├── icon16.png           # Extension icon (16x16)
├── icon48.png           # Extension icon (48x48)
├── icon128.png          # Extension icon (128x128)
└── README.md            # This file
```

## 🎨 Technical Details

### Permissions

- `scripting`: Inject content scripts for comment detection
- `activeTab`: Access current tab for search functionality

### Supported Selectors

The extension automatically detects comments using multiple selectors:

**YouTube:**

- `#content-text` - Standard comment text
- `ytd-comment-view-model #content-text` - New YouTube structure
- `yt-attributed-string span` - Comment spans

**Reddit:**

- `div[data-test-id="comment"]` - Comment containers
- `[data-testid="comment"] p` - Comment paragraphs
- `div[id^="t1_"] .usertext-body` - Comment threads

### Key Technologies

- **Manifest V3**: Latest Chrome extension standard
- **MutationObserver**: Detects dynamically loaded content
- **Custom Events**: Communication between popup and content script
- **Debounced Search**: Performance optimization for auto-detection

## 🔧 Development

### Prerequisites

- Google Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript

### Setup for Development

1. Clone this repository
2. Make your changes to the source files
3. Reload the extension in `chrome://extensions/`
4. Test on YouTube/Reddit pages

### Adding New Platforms

To add support for other platforms:

1. Identify comment selectors for the new platform
2. Add selectors to the `selectors` array in `content.js`
3. Update `manifest.json` to include new domains
4. Test thoroughly

## 🐛 Troubleshooting

### Extension Not Working

- Ensure Developer Mode is enabled
- Check if extension is loaded and active
- Refresh the page after installation
- Check browser console for error messages

### Comments Not Being Found

- Try refreshing the page
- Ensure you're on a supported platform (YouTube/Reddit)
- Check if comments have loaded completely
- Try both loose and strict search modes

### Performance Issues

- Clear search before starting new searches
- Avoid searching very common words
- Close unnecessary tabs to free up memory

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues or have suggestions:

- Open an issue on GitHub
- Check the troubleshooting section above
- Review browser console for error messages

## 🔮 Future Features

- [ ] Support for more platforms (Twitter, Facebook, etc.)
- [ ] Search history and saved searches
- [ ] Custom highlight colors
- [ ] Export search results
- [ ] Keyboard shortcuts
- [ ] Search statistics

---

**Made with ❤️ for better comment browsing experience**
