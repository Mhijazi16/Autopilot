import React from 'react';
import botLogo from '../../assets/icons/bot-logo.png';
import './MessageItem.css';
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";


const MessageItem = ({ msg }) => {

  return (
    <div className={`message-item ${msg.sender}`}>
      {msg.sender === 'bot' && (
        <div className="avatar">
          <img src={botLogo} alt="Bot Icon" />
        </div>
      )}
      <span className="message-text">{msg.sender === 'bot' ? (
          <Markdown remarkPlugins={[remarkGfm]}>{msg.text}</Markdown>
        ) : (
          <span>{msg.text}</span>
        )}</span>
      {msg.sender === 'user' && <div className="spacer" />}
    </div>
  );
};

export default MessageItem;