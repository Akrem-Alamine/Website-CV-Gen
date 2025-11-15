const axios = require('axios');

const GROK_API_URL = process.env.GROK_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
const GROK_API_KEY = process.env.GROK_API_KEY;

/**
 * Extract structured data from CV text using Groq AI (Llama models)
 */
async function extractCVData(cvText) {
  if (!GROK_API_KEY) {
    throw new Error('GROK_API_KEY is not configured. Please set it in your .env file.');
  }

  const prompt = `You are an expert CV/Resume parser. Extract and structure the following information from the CV text below. Return ONLY a valid JSON object with no additional text or markdown formatting.

Required JSON structure:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string",
    "website": "string",
    "title": "string (professional title/headline)"
  },
  "summary": "string (professional summary or objective)",
  "experience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "string",
      "endDate": "string (or 'Present')",
      "description": "string",
      "achievements": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "string",
      "endDate": "string",
      "gpa": "string (optional)"
    }
  ],
  "skills": {
    "technical": ["string"],
    "soft": ["string"],
    "languages": ["string"]
  },
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "link": "string (optional)"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "string"
    }
  ],
  "awards": ["string"]
}

CV Text:
${cvText}

Return only the JSON object:`;

  try {
    const response = await axios.post(
      GROK_API_URL,
      {
        model: 'llama-3.1-8b-instant', // Groq's Llama 8B Instant model
        messages: [
          {
            role: 'system',
            content: 'You are a precise CV parser that returns only valid JSON without any markdown formatting or additional text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    let jsonText = content;
    if (content.startsWith('```')) {
      jsonText = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    const structuredData = JSON.parse(jsonText);
    return structuredData;

  } catch (error) {
    console.error('Grok API Error:', error.response?.data || error.message);
    throw new Error(`Failed to extract CV data with Grok AI: ${error.message}`);
  }
}

/**
 * Generate website design suggestions using Grok AI
 */
async function generateDesignSuggestions(cvData) {
  if (!GROK_API_KEY) {
    throw new Error('GROK_API_KEY is not configured.');
  }

  const prompt = `Based on this professional profile, suggest a color scheme and design style for their personal website:

Professional Title: ${cvData.personalInfo?.title || 'Professional'}
Industry/Field: ${cvData.experience?.[0]?.position || 'General'}
Skills: ${cvData.skills?.technical?.slice(0, 5).join(', ') || 'Various'}

Return a JSON object with:
{
  "colorScheme": {
    "primary": "hex color",
    "secondary": "hex color",
    "accent": "hex color",
    "background": "hex color",
    "text": "hex color"
  },
  "style": "modern|minimalist|creative|corporate",
  "font": "font family suggestion"
}`;

  try {
    const response = await axios.post(
      GROK_API_URL,
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content.trim();
    let jsonText = content;
    if (content.startsWith('```')) {
      jsonText = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    return JSON.parse(jsonText);
  } catch (error) {
    // Return default design if AI fails
    return {
      colorScheme: {
        primary: '#2563eb',
        secondary: '#1e40af',
        accent: '#3b82f6',
        background: '#ffffff',
        text: '#1f2937'
      },
      style: 'modern',
      font: 'Inter, sans-serif'
    };
  }
}

module.exports = {
  extractCVData,
  generateDesignSuggestions
};
