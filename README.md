# Google Form Prefill Link Generator

A Chrome extension that automatically generates pre-filled Google Form URLs, making it easy to share forms with pre-populated responses.

## 🚀 Features

- **Automatic Form Detection**: Automatically detects and analyzes Google Form fields
- **Multi-Page Support**: Tracks form data across multiple pages
- **One-Click Generation**: Generate pre-filled URLs with a single click
- **Easy Sharing**: Copy pre-filled links to clipboard instantly
- **Privacy Focused**: No data is stored or transmitted to external servers
- **User-Friendly**: Simple, accessible interface designed for all users
- **Comprehensive Help**: Built-in help system with step-by-step instructions

## 📋 How to Use

1. **Navigate to a Google Form** that you want to create a pre-filled link for
2. **Fill in example responses** in the form fields (this will be the pre-filled data)
3. **For multi-page forms**: Click "Next" to navigate through all pages and fill responses
4. **Click the extension icon** in your browser toolbar
5. **Wait for analysis** - the extension will automatically detect form fields
6. **Click "Copy Link"** to copy the pre-filled URL to your clipboard
7. **Share the link** - when others open it, the form will be pre-filled with your example responses

## 🎯 Use Cases

- **Event Registration**: Pre-fill participant information
- **Survey Distribution**: Share surveys with demographic data pre-filled
- **Contact Forms**: Pre-fill contact information for different departments
- **Application Forms**: Streamline application processes
- **Feedback Collection**: Pre-fill context information

## 🔧 Technical Details

### Permissions Required
- `activeTab`: To access the current Google Form page
- `scripting`: To inject content scripts for form analysis
- `storage`: For temporary multi-page form data storage

### Host Permissions
- `https://docs.google.com/forms/*`: To access Google Forms pages

### Privacy & Security
- **No Data Collection**: The extension does not collect, store, or transmit any user data
- **Local Processing**: All form analysis happens locally in the browser
- **No External Requests**: No network requests are made to external servers
- **Open Source**: Full source code is available for transparency

## 📦 Installation

### From Chrome Web Store (Recommended)
1. Visit the Chrome Web Store listing
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Development)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will appear in your toolbar

## 🛠️ Development

### Project Structure
```
googleFormPrefill/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.js              # Popup functionality
├── content.js            # Content script for form analysis
├── icon.png              # Extension icon
├── icon.svg              # Extension icon (SVG)
├── privacy-policy.html   # Privacy policy
└── README.md            # This file
```

### Building for Production
1. Ensure all files are present and properly configured
2. Test the extension thoroughly
3. Create a ZIP file of the extension folder
4. Submit to Chrome Web Store Developer Dashboard

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📞 Support

For support, please:
1. Check the built-in help system in the extension
2. Review this README for common issues
3. Open an issue on the GitHub repository
4. Contact: contract@app-alive.com

## 🔗 Links

- **Privacy Policy**: [https://chanondb.github.io/google-prefill-form/privacy-policy.html](https://chanondb.github.io/google-prefill-form/privacy-policy.html)
- **GitHub Repository**: [https://github.com/chanondb/google-prefill-form](https://github.com/chanondb/google-prefill-form)

---

**Version**: 1.0.0  
**Chrome Version**: 88+  
**Manifest Version**: 3 