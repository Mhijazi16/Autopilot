
import React from 'react';
import MessageItem from './MessageItem';
import './MessageList.css';
import { SkeletonTheme } from 'react-loading-skeleton';

const MessageList = ({ messages, messagesEndRef}) => {
  return (
    <div className="message-list">
      <SkeletonTheme baseColor="#242730" highlightColor="rgb(50, 65, 95)">
      <div className="message-list-inner">
        {messages.map((msg) => (
          <MessageItem key={msg.id} msg={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      </SkeletonTheme>
    </div>
  );
};

export default MessageList;
