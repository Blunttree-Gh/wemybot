// /frontendnpm/src/pages/FileUploadPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function FileUploadPage() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setExtractedText('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setError('');

      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setExtractedText(data.text);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>📄 Upload PDF or Image</h2>
        <Link to="/" style={{ color: '#61dafb', marginBottom: 20 }}>← Back to Chat</Link>

        <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {extractedText && (
          <div className="chat-box" style={{ marginTop: 20, maxWidth: '90%' }}>
            <h4>📝 Extracted Text:</h4>
            <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>{extractedText}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default FileUploadPage;
