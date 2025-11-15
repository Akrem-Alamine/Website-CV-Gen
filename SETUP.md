# 🚀 Quick Setup Guide

Welcome to the CV Website Generator! This guide will help you get started in minutes.

## ⚡ Quick Start (3 Steps)

### 1️⃣ Get Your Grok API Key

1. Visit: https://console.x.ai/
2. Sign up or log in with your X (Twitter) account
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy the generated key

### 2️⃣ Configure Your Environment

Open the `.env` file in the project root and add your API key:

```env
GROK_API_KEY=xai-your-actual-api-key-here
GROK_API_URL=https://api.x.ai/v1/chat/completions
PORT=3001
NODE_ENV=development
```

**Important:** Replace `xai-your-actual-api-key-here` with your real Grok API key!

### 3️⃣ Start the Application

#### Option A: Use the Quick Start Script (Easiest)
Double-click `start.bat` or run in terminal:
```bash
./start.bat
```

#### Option B: Manual Start
```bash
npm run dev
```

That's it! The application will open at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001

## 📝 Testing the Application

1. Open your browser and go to http://localhost:3000
2. Use the provided `sample-cv.txt` file to test
3. Drag and drop the file into the upload area
4. Wait a few seconds for the AI to process
5. View your generated website!

## 🎯 What Each File Does

| File | Purpose |
|------|---------|
| `server.js` | Main backend server |
| `services/cvParser.js` | Parses PDF, DOC, DOCX, TXT files |
| `services/grokService.js` | Communicates with Grok AI |
| `services/websiteGenerator.js` | Generates HTML/CSS |
| `client/src/App.jsx` | Main React application |
| `client/src/components/CVUploader.jsx` | File upload component |
| `client/src/components/WebsitePreview.jsx` | Preview generated site |

## 🔧 Common Issues & Solutions

### ❌ "GROK_API_KEY is not configured"
**Solution:** Make sure you've added your API key to the `.env` file

### ❌ "Port 3000 is already in use"
**Solution:** Close other applications using port 3000, or change the port in `client/vite.config.js`

### ❌ "Cannot find module..."
**Solution:** Run `npm install` in both root and `client` directories

### ❌ File upload fails
**Solution:** 
- Check file size is under 10MB
- Ensure file format is PDF, DOC, DOCX, or TXT
- Verify the `uploads` folder exists

## 💡 Tips for Best Results

1. **CV Format:** Use a well-structured CV with clear sections
2. **File Size:** Keep your CV under 5MB for faster processing
3. **Content:** Include all relevant information (contact, experience, education, skills)
4. **File Type:** PDF usually gives the best results

## 🌐 Next Steps After Setup

1. **Customize Design:**
   - Edit `services/websiteGenerator.js` for HTML structure
   - Modify CSS in the same file for styling

2. **Adjust AI Behavior:**
   - Edit prompts in `services/grokService.js`
   - Change JSON structure for different data extraction

3. **Add Features:**
   - Multiple website themes
   - User accounts
   - Website hosting integration
   - Custom domain support

## 📚 Additional Resources

- **Grok AI Documentation:** https://docs.x.ai/
- **React Documentation:** https://react.dev/
- **Express Documentation:** https://expressjs.com/
- **Vite Documentation:** https://vitejs.dev/

## 🆘 Need Help?

1. Check the main `README.md` for detailed documentation
2. Review the code comments for implementation details
3. Test with the provided `sample-cv.txt` file
4. Check the browser console and terminal for error messages

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Both servers start without errors
- ✅ Frontend loads at http://localhost:3000
- ✅ You can drag and drop a CV file
- ✅ The AI processes the CV successfully
- ✅ You see a beautiful generated website

---

**Happy Building! 🚀**

If you encounter any issues, refer to the troubleshooting section in the main README.md file.
