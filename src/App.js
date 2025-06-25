// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import UpgradePage from './pages/UpgradePage';
import FileUploadPage from './pages/FileUploadPage'; // Make sure this file exists and exports properly

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, provider: 'openai' }),
      });

      const data = await res.json();
      const botMessage = {
        text: data.reply || '🤖 No response from WemyBot.',
        sender: 'bot',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { text: '❌ Error reaching WemyBot API.', sender: 'bot' },
      ]);
    }

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>🤖 Welcome to WemyBot</h2>
        <Link to="/upgrade" style={{ color: '#61dafb', marginBottom: 10 }}>
          Upgrade to Premium
        </Link>
        <Link to="/upload" style={{ color: '#61dafb', marginBottom: 20 }}>
          Upload a File
        </Link>

        <div className="chat-box">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Ask WemyBot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatBot />} />
        <Route path="/upgrade" element={<UpgradePage />} />
        <Route path="/upload" element={<FileUploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
