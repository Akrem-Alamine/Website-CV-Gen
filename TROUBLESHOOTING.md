# 🔧 Troubleshooting Guide

Common issues and their solutions for the CV Website Generator.

## 📋 Table of Contents

1. [Installation Issues](#installation-issues)
2. [API Key Problems](#api-key-problems)
3. [File Upload Errors](#file-upload-errors)
4. [AI Processing Issues](#ai-processing-issues)
5. [Frontend Issues](#frontend-issues)
6. [Backend Issues](#backend-issues)
7. [Deployment Problems](#deployment-problems)
8. [Performance Issues](#performance-issues)

---

## 🔴 Installation Issues

### Problem: "npm install fails"

**Error Message:**
```
npm ERR! code ENOENT
npm ERR! syscall open
```

**Solutions:**
1. Make sure Node.js is installed:
```bash
node --version
npm --version
```

2. If not installed, download from: https://nodejs.org/

3. Clear npm cache:
```bash
npm cache clean --force
npm install
```

4. Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Problem: "Cannot find module" errors

**Solutions:**
1. Install dependencies in both locations:
```bash
npm install
cd client
npm install
cd ..
```

2. Check if all required packages are in package.json

3. Reinstall specific package:
```bash
npm install <package-name>
```

---

## 🔑 API Key Problems

### Problem: "GROK_API_KEY is not configured"

**Error in Console:**
```
Error: GROK_API_KEY is not configured. Please set it in your .env file.
```

**Solutions:**

1. **Check if .env file exists:**
```bash
# Windows PowerShell
Test-Path .env

# If false, create it:
copy .env.example .env
```

2. **Verify .env content:**
```env
GROK_API_KEY=xai-your-actual-key-here
GROK_API_URL=https://api.x.ai/v1/chat/completions
PORT=3001
NODE_ENV=development
```

3. **Get your API key:**
   - Visit: https://console.x.ai/
   - Create new API key
   - Copy and paste into .env

4. **Restart the server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

### Problem: "Invalid API Key" or "401 Unauthorized"

**Solutions:**

1. **Verify API key format:**
   - Should start with `xai-`
   - Check for extra spaces
   - Ensure no quotes around the key

2. **Check API key status:**
   - Log in to https://console.x.ai/
   - Verify key is active
   - Check usage limits

3. **Regenerate API key:**
   - Create new key in console
   - Update .env file
   - Restart server

---

## 📁 File Upload Errors

### Problem: "File upload fails"

**Error in Browser:**
```
Failed to process CV. Please try again.
```

**Solutions:**

1. **Check file size:**
   - Maximum: 10MB
   - Compress large files
   - Split very long CVs

2. **Verify file format:**
   - Supported: PDF, DOC, DOCX, TXT
   - Convert other formats
   - Ensure file isn't corrupted

3. **Check uploads directory:**
```bash
# Create if missing:
mkdir uploads
```

4. **Check file permissions:**
```bash
# Ensure uploads folder is writable
```

---

### Problem: "Cannot read PDF file"

**Solutions:**

1. **PDF might be password-protected:**
   - Remove password
   - Use unprotected version

2. **PDF might be scanned image:**
   - Use OCR tool first
   - Convert to searchable PDF
   - Or use TXT/DOC version

3. **Try different format:**
   - Export CV as DOCX
   - Or copy text to TXT file

---

## 🤖 AI Processing Issues

### Problem: "AI returns invalid JSON"

**Error in Console:**
```
SyntaxError: Unexpected token in JSON
```

**Solutions:**

1. **Lower temperature (in grokService.js):**
```javascript
temperature: 0.1  // Instead of 0.3
```

2. **Add retry logic:**
```javascript
// Try processing again
// Code already includes JSON cleanup
```

3. **Check CV content:**
   - Ensure CV has clear structure
   - Remove special characters
   - Use standard sections

---

### Problem: "AI extraction is inaccurate"

**Solutions:**

1. **Improve CV format:**
   - Use clear section headers
   - Include contact information
   - Use standard job titles

2. **Modify AI prompt (grokService.js):**
```javascript
// Add more specific instructions
"Extract the candidate's full name from the top of the CV..."
```

3. **Increase max_tokens:**
```javascript
max_tokens: 3000  // Instead of 2000
```

---

### Problem: "Request timeout"

**Error:**
```
Error: timeout of 30000ms exceeded
```

**Solutions:**

1. **Increase timeout:**
```javascript
// In grokService.js
axios.post(url, data, {
  timeout: 60000,  // 60 seconds
  headers: {...}
})
```

2. **Reduce CV size:**
   - Shorten content
   - Remove unnecessary sections

3. **Check internet connection:**
   - Verify stable connection
   - Test API endpoint

---

## 💻 Frontend Issues

### Problem: "Port 3000 already in use"

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Kill process on port 3000:**
```bash
# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

2. **Change port (client/vite.config.js):**
```javascript
export default defineConfig({
  server: {
    port: 3002,  // Change from 3000
    // ...
  }
})
```

---

### Problem: "Blank page / White screen"

**Solutions:**

1. **Check browser console:**
   - Press F12
   - Look for errors
   - Read error messages

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R
   - Clear cache and cookies

3. **Rebuild frontend:**
```bash
cd client
npm run build
npm run dev
```

---

### Problem: "API requests fail (CORS)"

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**

1. **Ensure proxy is configured (client/vite.config.js):**
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true
    }
  }
}
```

2. **Check backend CORS (server.js):**
```javascript
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

---

## ⚙️ Backend Issues

### Problem: "Port 3001 already in use"

**Solutions:**

1. **Kill process:**
```bash
# Windows PowerShell
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

2. **Change port (.env):**
```env
PORT=3002
```

---

### Problem: "Module not found"

**Error:**
```
Error: Cannot find module 'express'
```

**Solutions:**

1. **Install missing module:**
```bash
npm install express
```

2. **Reinstall all dependencies:**
```bash
rm -rf node_modules
npm install
```

---

### Problem: "Multer upload fails"

**Solutions:**

1. **Create uploads directory:**
```bash
mkdir uploads
```

2. **Check file size limit:**
```javascript
// In server.js
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // 10MB
});
```

3. **Verify file field name:**
```javascript
// Should be 'cv'
upload.single('cv')
```

---

## 🚀 Deployment Problems

### Problem: "Environment variables not working"

**Solutions:**

1. **On Heroku:**
```bash
heroku config:set GROK_API_KEY=your_key
heroku config
```

2. **On Railway:**
   - Add in dashboard
   - Variables section
   - Redeploy after adding

3. **On Vercel:**
   - Project settings
   - Environment variables
   - Add GROK_API_KEY

---

### Problem: "Build fails"

**Solutions:**

1. **Check Node.js version:**
```json
// In package.json
"engines": {
  "node": ">=16.0.0"
}
```

2. **Install devDependencies:**
```bash
npm install --include=dev
```

3. **Check build logs:**
   - Read error messages
   - Fix missing dependencies
   - Verify paths are correct

---

## 📊 Performance Issues

### Problem: "Slow CV processing"

**Solutions:**

1. **Optimize file size:**
   - Compress PDF
   - Reduce image quality
   - Remove unnecessary content

2. **Use faster model (if available):**
```javascript
model: 'grok-instant'  // If available
```

3. **Implement caching:**
```javascript
// Cache processed CVs
const cache = new Map();
```

---

### Problem: "High memory usage"

**Solutions:**

1. **Limit concurrent requests:**
```javascript
// Add rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});
```

2. **Clean up temp files:**
```javascript
// Already implemented in server.js
fs.unlinkSync(req.file.path);
```

3. **Restart server regularly:**
```bash
# Use PM2 for auto-restart
pm2 start server.js
```

---

## 🔍 Debugging Tips

### Enable Verbose Logging

**In server.js:**
```javascript
// Add detailed logging
console.log('File uploaded:', {
  filename: req.file.filename,
  size: req.file.size,
  mimetype: req.file.mimetype
});
```

**In grokService.js:**
```javascript
console.log('Sending to Grok:', {
  model: 'grok-beta',
  cvLength: cvText.length,
  timestamp: new Date().toISOString()
});
```

---

### Test Components Individually

1. **Test CV Parser:**
```javascript
// Create test file: test-parser.js
const parser = require('./services/cvParser');
parser.parseCV('sample-cv.txt')
  .then(text => console.log(text))
  .catch(err => console.error(err));
```

2. **Test Grok API:**
```javascript
// Create test file: test-grok.js
const grok = require('./services/grokService');
grok.extractCVData('Sample CV text...')
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.error(err));
```

---

## 📞 Getting More Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Read error messages carefully
3. ✅ Check browser console (F12)
4. ✅ Check server logs
5. ✅ Review relevant documentation

### What to Include When Asking

- Exact error message
- Steps to reproduce
- Your environment (OS, Node version)
- Relevant code snippets
- What you've tried already

### Resources

- **GitHub Issues**: Create detailed issue
- **Documentation**: Check all MD files
- **Stack Overflow**: Search for similar issues
- **xAI Community**: For Grok API issues

---

## ✅ Quick Diagnostic Checklist

Run through this checklist:

- [ ] Node.js installed? (`node --version`)
- [ ] Dependencies installed? (check `node_modules/`)
- [ ] .env file exists? (`Test-Path .env`)
- [ ] GROK_API_KEY set? (check `.env`)
- [ ] API key valid? (test at console.x.ai)
- [ ] Both servers running? (ports 3000 & 3001)
- [ ] Can access frontend? (http://localhost:3000)
- [ ] Backend responds? (http://localhost:3001/api/health)
- [ ] File uploads work? (test with sample-cv.txt)
- [ ] Browser console clean? (no errors in F12)

---

## 🎯 Still Having Issues?

1. **Try a fresh install:**
```bash
# Backup your .env file
copy .env .env.backup

# Clean install
rm -rf node_modules client/node_modules
npm install
cd client && npm install && cd ..

# Restore .env
copy .env.backup .env

# Start fresh
npm run dev
```

2. **Use the sample CV:**
   - Test with `sample-cv.txt`
   - This eliminates file format issues
   - Helps identify if issue is with your CV

3. **Check system requirements:**
   - Node.js 16+
   - 4GB+ RAM
   - Stable internet connection
   - Modern browser

---

**Remember:** Most issues are easily solved with:
- Restarting the server
- Checking the .env file
- Installing dependencies
- Reading error messages

**Good luck! 🍀**
