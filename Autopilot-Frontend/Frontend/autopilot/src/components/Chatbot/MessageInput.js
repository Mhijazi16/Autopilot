import React from 'react';
import './MessageInput.css';

const MessageInput = ({ input, setInput, handleSubmit, loading, handleStop }) => {
  
  const handleKeydown= (event) => {
    if(event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
      }
  return (
    <form onSubmit={(e) => handleSubmit(e)} className="message-input-form" >
      <div className="message-input-container">
        <textarea
          type="text"
          rows="1" 
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeydown}
          placeholder="Message Autopilot"
          className="message-input"
        >
        </textarea>
        {loading ? (
          <button type="button" onClick={handleStop} className="stop-button">
            Stop
          </button>
        ) : (
          <button type="submit" className="send-button">
            Send
          </button>
        )}
      </div>
    </form>
  );
};

export default MessageInput;
