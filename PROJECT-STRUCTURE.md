# 📂 Project Structure

```
CV Gen/
│
├── 📁 client/                          # Frontend React Application
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── CVUploader.jsx          # Drag & drop CV upload component
│   │   │   ├── CVUploader.css          # Upload component styles
│   │   │   ├── WebsitePreview.jsx      # Generated website preview
│   │   │   └── WebsitePreview.css      # Preview component styles
│   │   ├── App.jsx                     # Main application component
│   │   ├── App.css                     # Main app styles
│   │   ├── main.jsx                    # React entry point
│   │   └── index.css                   # Global styles
│   ├── index.html                      # HTML template
│   ├── vite.config.js                  # Vite configuration
│   └── package.json                    # Frontend dependencies
│
├── 📁 services/                        # Backend Services
│   ├── cvParser.js                     # CV file parsing logic
│   │   • Parses PDF files
│   │   • Parses Word documents (DOC/DOCX)
│   │   • Parses text files
│   │
│   ├── grokService.js                  # Grok AI Integration
│   │   • Connects to Grok API
│   │   • Extracts structured CV data
│   │   • Generates design suggestions
│   │
│   └── websiteGenerator.js             # Website Generation
│       • Creates HTML structure
│       • Generates CSS styling
│       • Applies AI-suggested designs
│
├── 📁 uploads/                         # Temporary file storage (auto-created)
│
├── 📁 .vscode/                         # VS Code settings
│   └── extensions.json                 # Recommended extensions
│
├── server.js                           # Express backend server
│   • Handles file uploads
│   • Processes CV through AI
│   • Returns generated website
│
├── package.json                        # Backend dependencies & scripts
├── .env                               # Environment variables (YOUR API KEY!)
├── .env.example                       # Environment template
├── .gitignore                         # Git ignore rules
├── start.bat                          # Quick start script
├── README.md                          # Main documentation
├── SETUP.md                           # Setup instructions
└── sample-cv.txt                      # Sample CV for testing
```

## 🔄 Application Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  USER UPLOADS CV                                                   │
│  (PDF, DOC, DOCX, TXT)                                            │
│         │                                                          │
│         ▼                                                          │
│  ┌─────────────────┐                                              │
│  │  CVUploader.jsx  │  (Frontend)                                 │
│  └────────┬─────────┘                                              │
│           │                                                        │
│           │ POST /api/upload-cv                                   │
│           ▼                                                        │
│  ┌─────────────────┐                                              │
│  │   server.js      │  (Backend)                                  │
│  └────────┬─────────┘                                              │
│           │                                                        │
│           │ 1. Parse File                                         │
│           ▼                                                        │
│  ┌─────────────────┐                                              │
│  │  cvParser.js     │  Extract text from CV                       │
│  └────────┬─────────┘                                              │
│           │                                                        │
│           │ 2. Extract Data                                       │
│           ▼                                                        │
│  ┌─────────────────┐                                              │
│  │ grokService.js   │  Send to Grok AI                           │
│  │                  │  (Llama 8B Instant)                         │
│  │                  │  Get structured JSON                        │
│  └────────┬─────────┘                                              │
│           │                                                        │
│           │ 3. Generate Website                                   │
│           ▼                                                        │
│  ┌──────────────────┐                                             │
│  │websiteGenerator  │  Create HTML & CSS                         │
│  └────────┬──────────┘                                             │
│           │                                                        │
│           │ Return generated website                              │
│           ▼                                                        │
│  ┌─────────────────┐                                              │
│  │WebsitePreview   │  (Frontend)                                  │
│  │                 │  • Show live preview                         │
│  │                 │  • Display code                              │
│  │                 │  • Download option                           │
│  └─────────────────┘                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎨 Component Hierarchy

```
App.jsx
├── Header
├── CVUploader.jsx (shown initially)
│   ├── Dropzone
│   ├── Feature Cards
│   └── Error Display
├── Loading Animation (during processing)
└── WebsitePreview.jsx (after generation)
    ├── Preview Tabs
    │   ├── Live Preview (iframe)
    │   ├── HTML Code
    │   ├── CSS Code
    │   └── JSON Data
    ├── Action Buttons
    │   ├── Download
    │   └── Reset
    └── Next Steps Guide
```

## 📊 Data Flow

```
1. CV File
   ↓
2. Raw Text String
   ↓
3. Grok AI Processing
   ↓
4. Structured JSON
   {
     personalInfo: {...},
     experience: [...],
     education: [...],
     skills: {...},
     projects: [...]
   }
   ↓
5. Generated Website
   {
     html: "...",
     css: "...",
     design: {...}
   }
   ↓
6. User Preview & Download
```

## 🔌 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/upload-cv` | POST | Upload and process CV file |
| `/api/health` | GET | Check server status |

## 🎯 Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|----------|
| **Frontend** | React 18 | UI components |
| | Vite | Fast build tool |
| | React Dropzone | File upload |
| | Axios | HTTP requests |
| **Backend** | Express | Web server |
| | Multer | File handling |
| | PDF-Parse | PDF extraction |
| | Mammoth | Word doc extraction |
| **AI** | Grok API | CV data extraction |
| | Llama 8B | Language model |

## 💾 File Storage

- **Temporary:** `uploads/` (deleted after processing)
- **Generated:** Returned to user, not stored server-side
- **User Downloads:** Saved to user's browser download folder

## 🔐 Security Considerations

- File size limited to 10MB
- Only allowed file types accepted
- Temporary files deleted after processing
- API key stored in environment variables
- No user data persistence on server

---

Need more details? Check the inline code comments in each file!
