# 🎨 AI-Powered CV Website Generator

Transform any CV/Resume into a beautiful, professional personal website using AI!

## ✨ Features

- 📄 Upload CV (PDF, DOC, DOCX, TXT)
- 🤖 AI-powered information extraction (Groq AI - Llama 3.1)
- 🎨 Automatic beautiful website generation
- 📱 Responsive design
- 💾 Download generated HTML

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Groq API Key ([Get one here](https://console.groq.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cv-website-generator.git
   cd cv-website-generator
   ```

2. **Install dependencies**
   ```bash
   # Backend
   npm install
   
   # Frontend
   cd client
   npm install
   cd ..
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your GROK_API_KEY
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Access the app**
   ```
   http://localhost:3000
   ```

## 📦 Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: React, Vite
- **AI**: Groq API (Llama 3.1 8B Instant)
- **File Processing**: pdf-parse, mammoth
- **Styling**: Modern CSS with animations

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions.

## 📝 License

MIT License
