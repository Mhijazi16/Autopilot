import React, { useState, useEffect, useRef } from 'react';
import botLogo from '../assets/icons/bot-logo.png';

const Chatbot = () => {
  const [messages, setMessages] = useState(() => {
    // Load messages from localStorage if available
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [{ sender: 'bot', text: 'Hello! How can I assist you today?' }];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const isNearBottom = messagesEndRef.current 
        && (messagesEndRef.current.getBoundingClientRect().top - window.innerHeight) < 100;
      
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    };
  
    handleScroll();
  }, [messages]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    setLoading(true);

    // Fetch response from Ollama API
    fetchResponse(input);
  };

  const fetchResponse = async (userInput) => {
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt: userInput,
          stream: true, 
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      // Check if streaming is enabled
      if (response.headers.get('Content-Type') === 'application/x-ndjson') {
        // Streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let botMessage = '';
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: '' },
        ]);

        const updateMessages = (currentBotMessage) => {
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            if (lastMessage.sender === 'bot') {
              return [
                ...prevMessages.slice(0, -1),
                { sender: 'bot', text: currentBotMessage },
              ];
            } else {
              return [...prevMessages, { sender: 'bot', text: currentBotMessage }];
            }
          });
        };

        while (true) {
          if (controller.signal.aborted) {
            console.log('Fetch aborted');
            break;
          }

          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(Boolean);

          for (const line of lines) {
            try {
              const json = JSON.parse(line);
              const text = json.response || json.choices?.[0]?.text || '';
              botMessage += text;
              updateMessages(botMessage);
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      } else {
        // Non-streaming response
        const data = await response.json();
        const botResponse = data.response;

        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: botResponse },
        ]);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Error fetching response:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: 'bot',
            text: 'An error occurred while fetching the response.',
          },
        ]);
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center mr-2">
                <img src={botLogo} alt="Bot Icon" className="h-10 w-10" />
              </div>
              
              )}
              <span
                className={`${
                  msg.sender === 'user'
                    ? 'bg-white text-black rounded-3xl shadow-md border border-gray-200'
                    : 'bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 text-gray-800 dark:text-gray-200'
                } p-4 max-w-full inline-block` }
                style={{ whiteSpace: 'pre-wrap' }}
                >
                {msg.text}
              </span>
              {msg.sender === 'user' && (
            <div className="w-10 h-10 flex-shrink-0 rounded-2xl flex items-center justify-center font-bold ml-2">
            </div>
)}

            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input Bar */}
      <form
  onSubmit={handleSubmit}
  className="fixed bottom-7 left-1/2 transform -translate-x-[30%] w-full max-w-2xl px-4"
  style={{ width: 'calc(100% - 4rem)', maxWidth: '700px' }} // Ensures alignment with chat width
>
  <div className="flex items-center bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg px-4 py-2 backdrop-blur-md">
    <input
      type="text"
      value={input}
      disabled={loading}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Message Autopilot"
      className="flex-grow bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none px-2"
    />
    {loading ? (
      <button
        type="button"
        onClick={handleStop}
        className="ml-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-300"
      >
        Stop
      </button>
    ) : (
      <button
        type="submit"
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
      >
        Send
      </button>
    )}
  </div>
</form>


    </div>
  );
};

export default Chatbot;
