# Google Form Prefill Link Generator

A Chrome extension that automatically generates pre-filled Google Form URLs, making it easy to share forms with pre-populated responses.

## 🚀 Features

- **Automatic Form Detection**: Automatically detects and analyzes Google Form fields
- **One-Click Generation**: Generate pre-filled URLs with a single click
- **Easy Sharing**: Copy pre-filled links to clipboard instantly
- **Privacy Focused**: No data is stored or transmitted to external servers
- **User-Friendly**: Simple, accessible interface designed for all users
- **Comprehensive Help**: Built-in help system with step-by-step instructions

## 📋 How to Use

1. **Navigate to a Google Form** that you want to create a pre-filled link for
2. **Fill in example responses** in the form fields (this will be the pre-filled data)
3. **Click the extension icon** in your browser toolbar
4. **Wait for analysis** - the extension will automatically detect form fields
5. **Click "Copy Link"** to copy the pre-filled URL to your clipboard
6. **Share the link** - when others open it, the form will be pre-filled with your example responses

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
- `storage`: For extension settings (future use)

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
└── README.md            # This file
```

### Building for Production
1. Ensure all files are present and properly configured
2. Test the extension thoroughly
3. Create a ZIP file of the extension folder
4. Submit to Chrome Web Store Developer Dashboard

## 📝 Chrome Web Store Requirements

### Store Listing Information

#### Extension Name
**Google Form Prefill Link Generator**

#### Short Description (132 characters max)
Generate pre-filled Google Form URLs automatically with one click.

#### Detailed Description
Transform your Google Forms workflow with this powerful extension that automatically generates pre-filled form URLs.

**Key Features:**
• **Automatic Detection**: Instantly analyzes Google Form fields and structure
• **One-Click Generation**: Create pre-filled URLs with a single click
• **Easy Sharing**: Copy links directly to clipboard for instant sharing
• **Privacy First**: No data collection or external requests - everything stays local
• **User-Friendly**: Clean, accessible interface designed for all users

**Perfect for:**
• Event organizers pre-filling participant information
• Survey creators sharing forms with demographic data
• Contact form managers streamlining submissions
• Application processes with pre-filled requirements
• Feedback collection with context information

**How it works:**
1. Navigate to any Google Form
2. Fill in example responses (this becomes your pre-filled data)
3. Click the extension icon
4. Copy the generated pre-filled link
5. Share with others - they'll see the form pre-filled with your example data

**Privacy & Security:**
✅ No data collection or storage
✅ No external server requests
✅ Local processing only
✅ Open source for transparency

**Requirements:**
• Must be on a Google Forms page (docs.google.com/forms)
• Form must have at least one filled field to generate a pre-filled URL

### Category
**Productivity**

### Language
**English**

### Target Audience
- Event organizers
- Survey creators
- Form administrators
- Business professionals
- Educators
- Anyone who uses Google Forms regularly

### Keywords
- google forms
- prefill
- form automation
- survey tools
- productivity
- form sharing
- url generator
- form prefill

### Screenshots Required
1. **Main Interface**: Show the popup with a generated pre-filled URL
2. **Help Modal**: Display the help system with instructions
3. **Error State**: Show the extension when not on a Google Form page
4. **Success State**: Show the extension after successfully generating a link

### Privacy Policy
The extension does not collect, store, or transmit any user data. All processing happens locally in the browser. No external requests are made.

### Support Information
- **Support Email**: [Your support email]
- **Website**: [Your website or GitHub repository]
- **Documentation**: Built-in help system within the extension

### Pricing
**Free** - No in-app purchases or premium features

### Content Rating
**Everyone** - No mature content, suitable for all ages

## 🚀 Publishing Checklist

### Before Submission
- [ ] Test extension thoroughly on various Google Forms
- [ ] Verify all permissions are necessary and minimal
- [ ] Ensure privacy policy is accurate
- [ ] Create high-quality screenshots
- [ ] Write compelling store listing content
- [ ] Test on different Chrome versions
- [ ] Verify no external dependencies
- [ ] Check for any console errors
- [ ] Ensure accessibility features work
- [ ] Test help system functionality

### Store Listing Assets
- [ ] Extension icon (128x128 PNG)
- [ ] Screenshots (1280x800 or 640x400)
- [ ] Promotional tile images
- [ ] Detailed description
- [ ] Privacy policy
- [ ] Support contact information

### Technical Requirements
- [ ] Manifest V3 compliance
- [ ] Proper permissions declaration
- [ ] Content security policy
- [ ] No external scripts
- [ ] Localized strings (if applicable)
- [ ] Proper error handling

## 📄 License

[Your chosen license - MIT, GPL, etc.]

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📞 Support

For support, please:
1. Check the built-in help system in the extension
2. Review this README for common issues
3. Open an issue on the GitHub repository
4. Contact support at [your email]

---

**Version**: 1.0.0  
**Last Updated**: [Current Date]  
**Chrome Version**: 88+  
**Manifest Version**: 3 