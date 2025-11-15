import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './CVUploader.css';

function CVUploader({ onWebsiteGenerated, onStartProcessing }) {
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('cv', file);

    setError(null);
    onStartProcessing();

    try {
      const response = await axios.post('/api/upload-cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onWebsiteGenerated(response.data);
      } else {
        setError('Failed to generate website. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.message || 
        'An error occurred while processing your CV. Please try again.'
      );
      onWebsiteGenerated(null);
    }
  }, [onWebsiteGenerated, onStartProcessing]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
  });

  return (
    <div className="uploader-container">
      <div className="upload-card">
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <svg
              className="upload-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {isDragActive ? (
              <p className="dropzone-text">Drop your CV here...</p>
            ) : (
              <>
                <p className="dropzone-text">
                  Drag & drop your CV here, or click to select
                </p>
                <p className="dropzone-subtext">
                  Supports PDF, DOC, DOCX, and TXT files (max 10MB)
                </p>
              </>
            )}
            <button className="upload-button" type="button">
              Choose File
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <svg
              className="error-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>{error}</p>
          </div>
        )}

        <div className="features">
          <div className="feature">
            <span className="feature-icon">🤖</span>
            <h3>AI-Powered</h3>
            <p>Grok AI extracts all information automatically</p>
          </div>
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <h3>Lightning Fast</h3>
            <p>Your website ready in seconds</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🎨</span>
            <h3>Beautiful Design</h3>
            <p>Professional and modern templates</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CVUploader;
