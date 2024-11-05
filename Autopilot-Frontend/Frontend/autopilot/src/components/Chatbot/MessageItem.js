// src/components/Chatbot/MessageItem.js

import React from 'react';
import botLogo from '../../assets/icons/bot-logo.png';
import './MessageItem.css';

const MessageItem = ({ msg }) => {
  return (
    <div className={`message-item ${msg.sender}`}>
      {msg.sender === 'bot' && (
        <div className="avatar">
          <img src={botLogo} alt="Bot Icon" />
        </div>
      )}
      <span className="message-text">{msg.text}</span>
      {msg.sender === 'user' && <div className="spacer" />}
    </div>
  );
};

export default MessageItem;
