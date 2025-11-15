import React, { useState } from 'react';
import CVUploader from './components/CVUploader';
import WebsitePreview from './components/WebsitePreview';
import './App.css';

function App() {
  const [generatedWebsite, setGeneratedWebsite] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleWebsiteGenerated = (websiteData) => {
    setGeneratedWebsite(websiteData);
    setLoading(false);
  };

  const handleStartProcessing = () => {
    setLoading(true);
  };

  const handleReset = () => {
    setGeneratedWebsite(null);
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="gradient-text">AI-Powered CV Website Generator</span>
          </h1>
          <p className="app-subtitle">
            Transform your CV into a stunning personal website in seconds
          </p>
          <div className="powered-by">
            <span>Powered by</span>
            <span className="grok-badge">Grok AI (Llama 8B)</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {!generatedWebsite && !loading && (
          <CVUploader 
            onWebsiteGenerated={handleWebsiteGenerated}
            onStartProcessing={handleStartProcessing}
          />
        )}

        {loading && (
          <div className="loading-container">
            <div className="loader"></div>
            <h2>Generating Your Website...</h2>
            <p>Our AI is analyzing your CV and creating a beautiful website for you</p>
            <div className="loading-steps">
              <div className="step">📄 Parsing your CV...</div>
              <div className="step">🤖 Extracting information with Grok AI...</div>
              <div className="step">🎨 Designing your personal website...</div>
              <div className="step">✨ Finalizing your masterpiece...</div>
            </div>
          </div>
        )}

        {generatedWebsite && !loading && (
          <WebsitePreview 
            websiteData={generatedWebsite}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 CV Website Generator. Built with React & Grok AI.</p>
      </footer>
    </div>
  );
}

export default App;
