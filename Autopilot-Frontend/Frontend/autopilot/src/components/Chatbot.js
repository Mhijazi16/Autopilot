// src/components/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stopResponse, setStopResponse] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    setLoading(true);

    // Simulate API call
    simulateResponse(input);
  };

  const simulateResponse = (userInput) => {
    // Simulate a delayed response
    const simulatedText = `You said: "${userInput}". Here's a response generated live.`;
    let index = 0;
    const interval = setInterval(() => {
      if (stopResponse) {
        clearInterval(interval);
        setStopResponse(false);
        setLoading(false);
        return;
      }
      if (index < simulatedText.length) {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage.sender === 'bot') {
            // Update last message
            return [
              ...prevMessages.slice(0, -1),
              { sender: 'bot', text: lastMessage.text + simulatedText[index] },
            ];
          } else {
            // Add new bot message
            return [...prevMessages, { sender: 'bot', text: simulatedText[index] }];
          }
        });
        index++;
      } else {
        clearInterval(interval);
        setLoading(false);
      }
    }, 50); // Adjust typing speed here
  };

  const handleStop = () => {
    setStopResponse(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            } mb-4`}
          >
            <div
              className={`${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              } rounded-lg p-4 max-w-xs`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center p-4 bg-white dark:bg-gray-800">
        <input
          type="text"
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message Autopilot"
          className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2 focus:outline-none"
        />
        {loading ? (
          <button
            type="button"
            onClick={handleStop}
            className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
};

export default Chatbot;
