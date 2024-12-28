import React, { useState, useEffect, useRef, useCallback } from "react";
import Toolbar from "./Toolbar/Toolbar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ResponseModal from "./ResponseModal";
import "./Chatbot.css";
import { v4 as uuidv4 } from 'uuid';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { debounce } from 'lodash';
import ManualAgents from "./Toolbar/ManualAgents/ManualAgents";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import defaultIcon from "./../../assets/icons/autopilot-button.png"

const Chatbot = () => {

  const [manualAgents, setManualAgents] = useState([
    { id: 1, text: "command", icon: defaultIcon, name: "default" }]);
    // {
    // {
      // 
    // }}
  const [manualAgentsModalOpen, showManualAgentsModal] = useState(false);
  const [modalOpen, showModal] = useState(false);
  const [modalCommandsInfo, setModalCommandsInfo] = useState("npm start");
  
  async function startManualAgents() {
    // Format manualAgents into the desired structure
    const formattedAgents = manualAgents
    .filter((agent) => agent.icon !== defaultIcon && agent.text.toLowerCase() !== "command")
    .map((agent) => ({
    agent: agent.name,
    task: agent.text,
  }));

    // Print the formatted array
    console.log(formattedAgents);

    try {
      const response = await fetch('http://127.0.0.1:8000/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedAgents),
      });

      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    const parsedMessages = savedMessages
      ? JSON.parse(savedMessages).map((msg) => ({
          ...msg,
          id: msg.id || uuidv4(), 
        }))
      : [
          {
            id: uuidv4(),
            sender: "bot",
            text: "Hello! How can I assist you today?",
            loading: false,
          },
        ];
    console.log("Initialized messages:", parsedMessages); 
    return parsedMessages;
  });
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const messagesEndRef = useRef(null);
  const intervalRef = useRef(null);


  useEffect(() => {
    const ws = new ReconnectingWebSocket("ws://127.0.0.1:8000/tools");
    ws.onopen = () => {
      console.log("tools connection established.");
    };
  
    ws.onmessage = (event) => {
      const line = event.data.trim();
      if(line !== ".")
      {

        try {
          const data = JSON.parse(event.data);
          console.log(data);
          setModalCommandsInfo(data);
          showModal(true);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      }
    };
  
    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
  
    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };
  
    return () => {
      ws.close();
      console.log("WebSocket connection cleanup.");
    };
  }, []);
  


  useEffect(() => {
    const scrollToBottom = debounce(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  
    scrollToBottom();
  
    return () => {
      scrollToBottom.cancel();
    };
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault(); 
    }
    if (!input.trim()) return;
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: uuidv4(), sender: "user", text: input },
      { id: uuidv4(), sender: "bot", text: "", loading: true }, 
    ]);
    setInput("");
    setLoading(true);
    fetchResponse(input);
  };

  const fetchResponse = async (userInput) => {
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch(`http://127.0.0.1:8000/chat?prompt=${encodeURIComponent(userInput)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const data = await response.json();
      if (!data || !data.message) {
        throw new Error("Invalid response format or missing 'message' property.");
      }
      const botMessage = data.message;
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastIndex = updatedMessages.length - 1;
        if (updatedMessages[lastIndex].sender === "bot" && updatedMessages[lastIndex].loading) {
          updatedMessages[lastIndex].loading = false;
        }
        return updatedMessages;
      });
      simulateLiveGeneration(botMessage);

    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching response:", error);
      
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastIndex = updatedMessages.length - 1;
      
          if (updatedMessages[lastIndex]?.sender === "bot" && updatedMessages[lastIndex]?.loading) {
            updatedMessages[lastIndex] = {
              ...updatedMessages[lastIndex],
              text: "", 
              loading: true,
            };
          } else {
            
            updatedMessages.push({
              id: uuidv4(),
              sender: "bot",
              text: "", 
              loading: true,
            });
          }
      
          return updatedMessages;
        });
      
        simulateLiveGeneration("Oops! Something went wrong while fetching the response. Please try again.");
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastIndex = updatedMessages.length - 1;
    
          if (updatedMessages[lastIndex]?.sender === "bot" && updatedMessages[lastIndex]?.loading) {
            updatedMessages[lastIndex].loading = false;
          }
    
          return updatedMessages;
        });
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
};

const simulateLiveGeneration = useCallback((message) => {
  let currentIndex = 0;
  const interval = 20; 

  intervalRef.current = setInterval(() => {
    if (currentIndex < message.length) {
      setMessages((prev) => {
        const updatedMessages = [...prev];
        const lastMessage = updatedMessages[updatedMessages.length - 1];

        if (lastMessage.sender === "bot") {
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            text: lastMessage.text + message[currentIndex],
          };
        }

        return updatedMessages;
      });
      currentIndex++;
    } else {
      clearInterval(intervalRef.current); 
    }
  }, interval);
}, []);

useEffect(() => {
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, []);


const handleStop = () => {
  if (abortController) abortController.abort();
};


  return (
    <>
      <Toolbar />
      <button className="show-manual-agents" onClick={() => showManualAgentsModal(true)}>Show</button>
      {
      manualAgentsModalOpen && (
        <DndProvider backend={HTML5Backend}>
          <ManualAgents
            manualAgents={manualAgents}
            setManualAgents={setManualAgents}
            showModal={showManualAgentsModal}
            startManualAgents={startManualAgents}
          />
        </DndProvider>
      )}
      
      <ResponseModal 
        isOpen={modalOpen} 
        showModal={showModal} 
        commandsInfo={modalCommandsInfo}
        setCommandsInfo={setModalCommandsInfo}
      />
      <div className="flex flex-col h-full relative">
        <MessageList messages={messages} messagesEndRef={messagesEndRef}/>
        <MessageInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          loading={loading}
          handleStop={handleStop}
        />
      </div>
    </>
  );
};

export default Chatbot;
