import React, { useState } from 'react';

const Home = () => {
  const [file, setFile] = useState(null);
  const [uploadText, setUploadText] = useState('');
  const [message, setMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert('Please select a file.');

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setUploadText(data.text || 'Failed to extract text');
  };

  const handleChat = async () => {
    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setChatResponse(data.reply || 'No response');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📎 Upload File & Chat with WemyBot 🤖</h1>

      <div style={{ marginBottom: 20 }}>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <pre>{uploadText}</pre>
      </div>

      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
        />
        <button onClick={handleChat}>Send</button>
        <pre>{chatResponse}</pre>
      </div>
    </div>
  );
};

export default Home;
