import React, { useState } from 'react';
import './WebsitePreview.css';

function WebsitePreview({ websiteData, onReset }) {
  const [activeTab, setActiveTab] = useState('preview');
  const { html, css, data } = websiteData.website;

  const downloadWebsite = () => {
    // Create a zip-like structure (simplified version)
    const fullHTML = html.replace('</head>', `<style>${css}</style></head>`);
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h2>🎉 Your Website is Ready!</h2>
        <p>Preview your generated website below</p>
      </div>

      <div className="preview-tabs">
        <button
          className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          👁️ Preview
        </button>
        <button
          className={`tab ${activeTab === 'html' ? 'active' : ''}`}
          onClick={() => setActiveTab('html')}
        >
          📝 HTML
        </button>
        <button
          className={`tab ${activeTab === 'css' ? 'active' : ''}`}
          onClick={() => setActiveTab('css')}
        >
          🎨 CSS
        </button>
        <button
          className={`tab ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          📊 Data
        </button>
      </div>

      <div className="preview-content">
        {activeTab === 'preview' && (
          <div className="preview-frame-container">
            <iframe
              srcDoc={html.replace('</head>', `<style>${css}</style></head>`)}
              title="Website Preview"
              className="preview-frame"
              sandbox="allow-same-origin"
            />
          </div>
        )}

        {activeTab === 'html' && (
          <div className="code-container">
            <button
              className="copy-button"
              onClick={() => copyCode(html)}
            >
              📋 Copy HTML
            </button>
            <pre className="code-block">
              <code>{html}</code>
            </pre>
          </div>
        )}

        {activeTab === 'css' && (
          <div className="code-container">
            <button
              className="copy-button"
              onClick={() => copyCode(css)}
            >
              📋 Copy CSS
            </button>
            <pre className="code-block">
              <code>{css}</code>
            </pre>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="code-container">
            <button
              className="copy-button"
              onClick={() => copyCode(JSON.stringify(data, null, 2))}
            >
              📋 Copy JSON
            </button>
            <pre className="code-block">
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>

      <div className="preview-actions">
        <button className="action-button download" onClick={downloadWebsite}>
          ⬇️ Download Website
        </button>
        <button className="action-button reset" onClick={onReset}>
          🔄 Generate Another
        </button>
      </div>

      <div className="next-steps">
        <h3>📚 Next Steps:</h3>
        <ul>
          <li>Download the HTML file and customize it further</li>
          <li>Host it on GitHub Pages, Netlify, or Vercel</li>
          <li>Add your own domain name</li>
          <li>Customize colors and content as needed</li>
        </ul>
      </div>
    </div>
  );
}

export default WebsitePreview;
