import React from 'react';

const ChatBox = ({ chat }) => (
  <div className="card mb-3">
    <div className="card-body">
      {chat.messages.map((msg, idx) => (
        <p key={idx}><strong>{msg.sender === 'garage' ? 'Gara' : 'Khách'}:</strong> {msg.message}</p>
      ))}
    </div>
  </div>
);

export default ChatBox;