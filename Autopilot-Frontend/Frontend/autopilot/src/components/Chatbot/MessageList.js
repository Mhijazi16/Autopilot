// src/components/Chatbot/MessageList.js

import React from 'react';
import MessageItem from './MessageItem';
import './MessageList.css';

const MessageList = ({ messages, messagesEndRef }) => {
  return (
    <div className="message-list">
      <div className="message-list-inner">
        {messages.map((msg, index) => (
          <MessageItem key={index} msg={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
