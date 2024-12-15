import React, { useState, useEffect, useRef } from "react";
import Toolbar from "./Toolbar/Toolbar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ResponseModal from "./ResponseModal";
import "./Chatbot.css";

const Chatbot = () => {

  const [modalOpen, showModal] = useState(false);
  const [modalCommandsInfo, setModalCommandsInfo] = useState("npm start");
  

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [{ sender: "bot", text: "Hello! How can I assist you today?" }];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/tools");
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
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
      console.log("WebSocket connection cleanup.");
    };
  }, []);
  


  useEffect(() => {
    try  {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    } catch(error) {
      console.error("Error saving messages to localStorage:", error);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
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
      console.log(response);
      const data = await response.json();
      const botMessage = data.response || "No response";
      setMessages((prev) => [
        ...prev, 
        {sender: "bot", text: botMessage},
      ]);

      
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching response:", error);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "An error occurred while fetching the response.",
          },
        ]);
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const handleStop = () => {
    if (abortController) abortController.abort();
  };

  return (
    <>
      <Toolbar />
      <ResponseModal isOpen={modalOpen} showModal={showModal} commandsInfo={modalCommandsInfo}
      setCommandsInfo={setModalCommandsInfo}/>
      <div className="flex flex-col h-full relative">
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
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
