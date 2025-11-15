# 🤖 Grok AI Configuration Guide

This guide explains how to configure and optimize the Grok AI integration for your CV Website Generator.

## 📋 Table of Contents
1. [Getting Your API Key](#getting-your-api-key)
2. [API Configuration](#api-configuration)
3. [Understanding the AI Prompts](#understanding-the-ai-prompts)
4. [Customizing AI Behavior](#customizing-ai-behavior)
5. [Cost Management](#cost-management)
6. [Troubleshooting](#troubleshooting)

## 🔑 Getting Your API Key

### Step-by-Step Guide

1. **Visit xAI Console**
   - Go to: https://console.x.ai/
   - Sign in with your X (Twitter) account

2. **Navigate to API Keys**
   - Click on "API Keys" in the sidebar
   - You may need to verify your account first

3. **Create New API Key**
   - Click "Create API Key" or "+ New API Key"
   - Give it a descriptive name (e.g., "CV Generator")
   - Copy the key immediately (you won't see it again!)

4. **Save Your Key**
   - Paste it in your `.env` file
   - Never commit this file to Git
   - Keep it secure and private

### Example .env Configuration

```env
# Your Grok API Key (REQUIRED)
GROK_API_KEY=xai-abc123def456ghi789jkl012mno345pqr678

# API Endpoint (default - usually no need to change)
GROK_API_URL=https://api.x.ai/v1/chat/completions

# Server Port
PORT=3001

# Environment
NODE_ENV=development
```

## ⚙️ API Configuration

### Current Model
- **Model Name:** `grok-beta` (Llama 8B Instant)
- **Context Window:** 8,192 tokens
- **Optimized For:** Fast inference and general tasks

### Request Parameters

Located in `services/grokService.js`:

```javascript
{
  model: 'grok-beta',           // Model identifier
  messages: [...],              // Conversation messages
  temperature: 0.3,             // Lower = more focused (0.0-2.0)
  max_tokens: 2000              // Maximum response length
}
```

### Parameter Tuning

| Parameter | Current | Purpose | Recommended Range |
|-----------|---------|---------|-------------------|
| `temperature` | 0.3 | Controls randomness | 0.1-0.5 for CV parsing |
| `max_tokens` | 2000 | Response length limit | 1500-3000 |
| `top_p` | (default) | Nucleus sampling | 0.9-1.0 |

## 📝 Understanding the AI Prompts

### CV Data Extraction Prompt

Located in `services/grokService.js` → `extractCVData()`:

```javascript
const prompt = `You are an expert CV/Resume parser. Extract and structure 
the following information from the CV text below. Return ONLY a valid JSON 
object with no additional text or markdown formatting.

Required JSON structure:
{
  "personalInfo": { ... },
  "summary": "...",
  "experience": [ ... ],
  "education": [ ... ],
  "skills": { ... },
  "projects": [ ... ],
  "certifications": [ ... ],
  "awards": [ ... ]
}

CV Text:
${cvText}
`;
```

**Why This Works:**
- Clear instructions for the AI
- Specifies exact JSON structure
- Emphasizes "ONLY valid JSON"
- Prevents markdown code blocks

### Design Suggestions Prompt

Located in `services/grokService.js` → `generateDesignSuggestions()`:

```javascript
const prompt = `Based on this professional profile, suggest a color 
scheme and design style for their personal website:

Professional Title: ${cvData.personalInfo?.title}
Industry/Field: ${cvData.experience?.[0]?.position}
Skills: ${cvData.skills?.technical?.slice(0, 5).join(', ')}
`;
```

**Purpose:**
- Personalized design based on profession
- Industry-appropriate color schemes
- Matches user's professional brand

## 🎨 Customizing AI Behavior

### 1. Modify Data Structure

Edit the JSON structure in the prompt to extract different fields:

```javascript
// Add new fields
"portfolio": "string",
"hobbies": ["string"],
"publications": [
  {
    "title": "string",
    "venue": "string",
    "year": "string"
  }
]
```

### 2. Adjust Temperature

```javascript
// More creative (0.7-1.0)
temperature: 0.8

// More focused and consistent (0.1-0.5)
temperature: 0.2
```

**Use Cases:**
- **0.1-0.3:** CV parsing (current) - most accurate
- **0.4-0.6:** Design suggestions - balanced
- **0.7-1.0:** Creative content generation

### 3. Change System Message

```javascript
messages: [
  {
    role: 'system',
    content: 'You are a precise CV parser specialized in tech resumes...'
  },
  // ... rest of messages
]
```

### 4. Add Few-Shot Examples

Improve accuracy by providing examples:

```javascript
messages: [
  {
    role: 'system',
    content: 'You are a CV parser. Here are examples...'
  },
  {
    role: 'user',
    content: 'Example CV: John Doe, Software Engineer...'
  },
  {
    role: 'assistant',
    content: '{"personalInfo": {"fullName": "John Doe"...}}'
  },
  {
    role: 'user',
    content: prompt  // Your actual CV
  }
]
```

## 💰 Cost Management

### Grok API Pricing (as of 2025)

- **Input Tokens:** ~$X per 1M tokens
- **Output Tokens:** ~$X per 1M tokens
- Check latest pricing: https://x.ai/pricing

### Estimated Costs per CV

| CV Size | Input Tokens | Output Tokens | Cost (est.) |
|---------|--------------|---------------|-------------|
| Small (1 page) | ~500 | ~800 | $0.00X |
| Medium (2 pages) | ~1000 | ~1200 | $0.00X |
| Large (3+ pages) | ~2000 | ~1500 | $0.00X |

### Cost Optimization Tips

1. **Limit Token Usage**
```javascript
max_tokens: 1500  // Reduce from 2000
```

2. **Truncate Long CVs**
```javascript
const truncatedCV = cvText.slice(0, 10000); // First 10k chars
```

3. **Cache Common Results**
```javascript
// Store processed CVs temporarily
const cache = new Map();
```

4. **Batch Processing**
- Process multiple CVs together
- Share context when possible

## 🔧 Troubleshooting

### Issue: "API Key Not Configured"

**Solution:**
```bash
# Check if .env file exists
ls .env

# Verify it contains your key
cat .env

# Restart the server
npm run dev
```

### Issue: "Invalid JSON Response"

**Cause:** AI returned text with markdown formatting

**Solution:** The code already handles this:
```javascript
let jsonText = content;
if (content.startsWith('```')) {
  jsonText = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
}
```

**If still failing:**
1. Lower temperature to 0.1
2. Add stricter prompt instructions
3. Implement retry logic

### Issue: "Rate Limit Exceeded"

**Solutions:**
1. Add rate limiting:
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

2. Implement exponential backoff:
```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
}
```

### Issue: "Timeout Error"

**Solutions:**
1. Increase timeout:
```javascript
axios.post(GROK_API_URL, data, {
  timeout: 30000, // 30 seconds
  headers: {...}
})
```

2. Process shorter CV segments

### Issue: Inaccurate Data Extraction

**Solutions:**
1. **Improve Prompt:**
```javascript
// Add specific instructions
"Extract the candidate's email address from common formats like:
- name@domain.com
- firstname.lastname@company.com"
```

2. **Add Validation:**
```javascript
// Validate extracted data
function validateCVData(data) {
  if (!data.personalInfo?.email?.includes('@')) {
    throw new Error('Invalid email extracted');
  }
  // ... more validations
}
```

3. **Post-Process Results:**
```javascript
// Clean and normalize data
function cleanData(data) {
  if (data.personalInfo?.phone) {
    data.personalInfo.phone = data.personalInfo.phone.replace(/[^\d+()-]/g, '');
  }
  return data;
}
```

## 🚀 Advanced Features

### 1. Multi-Language Support

```javascript
const prompt = `Extract CV data. The CV might be in English, French, or Spanish.
Translate all content to English in the output.`;
```

### 2. Industry-Specific Parsing

```javascript
// Detect industry first
const industry = await detectIndustry(cvText);

// Use specialized prompt
const prompt = getIndustryPrompt(industry);
```

### 3. Quality Scoring

```javascript
// Add quality assessment
"Also rate the CV quality from 1-10 and provide improvement suggestions."
```

## 📊 Monitoring & Analytics

### Track API Usage

```javascript
let apiCallCount = 0;
let totalTokensUsed = 0;

// In grokService.js
apiCallCount++;
totalTokensUsed += response.data.usage.total_tokens;

console.log(`API Calls: ${apiCallCount}, Tokens: ${totalTokensUsed}`);
```

### Log Errors

```javascript
// Add comprehensive logging
console.error('Grok API Error:', {
  timestamp: new Date().toISOString(),
  error: error.message,
  cvLength: cvText.length,
  response: error.response?.data
});
```

## 📚 Additional Resources

- **xAI Documentation:** https://docs.x.ai/
- **API Reference:** https://docs.x.ai/api
- **Best Practices:** https://docs.x.ai/guides/best-practices
- **Community:** https://community.x.ai/

---

**Questions?** Check the main README.md or create an issue on GitHub.
