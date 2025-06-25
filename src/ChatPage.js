import React, { useState } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return;

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        message,
        provider: 'openai' // change to 'ollama' if using local model
      });
      setReply(res.data.reply);
    } catch (err) {
      console.error('WemyBot API Error:', err);
      setReply('❌ Error reaching WemyBot API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>💬 Chat with WemyBot</h2>
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: '70%', padding: '10px' }}
      />
      <button onClick={sendMessage} style={{ padding: '10px', marginLeft: '10px' }}>
        Send
      </button>
      <div style={{ marginTop: '20px' }}>
        {loading ? '⌛ Loading reply...' : <p><strong>Reply:</strong> {reply}</p>}
      </div>
    </div>
  );
};

export default ChatPage;
