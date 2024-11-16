import React from 'react';
import botLogo from '../../assets/icons/bot-logo.png';
import './MessageItem.css';
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypePrism from 'rehype-prism';


const MessageItem = ({ msg }) => {

  const markdownText = ({text}) => {
    return (
      <Markdown 
        children={text}
        remarkPlugins={remarkGfm}
        // rehypePlugins={rehypePrism}
      >
      </Markdown>
    );
  }
  return (
    <div className={`message-item ${msg.sender}`}>
      {msg.sender === 'bot' && (
        <div className="avatar">
          <img src={botLogo} alt="Bot Icon" />
        </div>
      )}
      <span className="message-text">
        {msg.sender === 'bot' ? (
          <Markdown remarkPlugins={remarkGfm}>{msg.text}</Markdown>
        ) : (
          <span>{msg.text}</span>
        )}</span>
      {msg.sender === 'user' && <div className="spacer" />}
    </div>
  );
};

export default MessageItem;