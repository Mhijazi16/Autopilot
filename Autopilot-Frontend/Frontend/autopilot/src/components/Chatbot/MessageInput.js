import React from 'react';
import './MessageInput.css';

const MessageInput = ({ input, setInput, handleSubmit, loading, handleStop }) => {
  return (
    <form onSubmit={handleSubmit} className="message-input-form" >
      <div className="message-input-container">
        <textarea
          type="text"
          rows="1" 
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
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
