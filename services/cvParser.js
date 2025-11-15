const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Parse CV file and extract text content
 * Supports PDF, DOCX, and TXT formats
 */
async function parseCV(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  try {
    switch (ext) {
      case '.pdf':
        return await parsePDF(filePath);
      
      case '.docx':
      case '.doc':
        return await parseDOCX(filePath);
      
      case '.txt':
        return await parseTXT(filePath);
      
      default:
        throw new Error(`Unsupported file format: ${ext}`);
    }
  } catch (error) {
    throw new Error(`Failed to parse CV: ${error.message}`);
  }
}

/**
 * Parse PDF file
 */
async function parsePDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

/**
 * Parse DOCX file
 */
async function parseDOCX(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

/**
 * Parse TXT file
 */
async function parseTXT(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

module.exports = {
  parseCV
};
