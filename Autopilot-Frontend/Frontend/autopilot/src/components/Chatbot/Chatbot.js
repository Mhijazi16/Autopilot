import React, { useState, useEffect, useRef, useCallback } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { debounce } from "lodash";
import { v4 as uuidv4 } from "uuid";

import Toolbar from "./Toolbar/Toolbar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ResponseModal from "./ResponseModal";


const Chatbot = ({ chatWs, messages, setMessages }) => {
  const [modalOpen, showModal] = useState(false);
  const [modalCommandsInfo, setModalCommandsInfo] = useState("npm start");


  const [input, setInput] = useState("");
  const [abortController, setAbortController] = useState(null);

  const messagesEndRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const wsTools = new ReconnectingWebSocket("ws://127.0.0.1:8000/tools");

    wsTools.onopen = () => {
      console.log("tools connection established.");
    };

    wsTools.onmessage = (event) => {
      const line = event.data.trim();
      if (line !== ".") {
        try {
          const data = JSON.parse(event.data);
          setModalCommandsInfo(data);
          showModal(true);
        } catch (error) {
          console.error("Error parsing tools WebSocket message:", error);
        }
      }
    };

    wsTools.onerror = (error) => {
      console.error("tools WebSocket Error:", error);
    };

    wsTools.onclose = () => {
      console.log("tools WebSocket connection closed.");
    };

    return () => {
      wsTools.close();
    };
  }, []);

  

  const simulateLiveGeneration = useCallback((message) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  
    let currentIndex = 0;
    const interval = 20; 
  
    intervalRef.current = setInterval(() => {
      if (currentIndex < message.length) {
        const currentChar = message[currentIndex];
        
        if (currentChar !== undefined) {
          setMessages((prev) => {
            const updatedMessages = [...prev];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
  
            if (lastMessage.sender === "bot") {
              updatedMessages[updatedMessages.length - 1] = {
                ...lastMessage,
                text: lastMessage.text + currentChar,
              };
            }
  
            return updatedMessages;
          });
          currentIndex++;
        } else {
          // If undefined, stop the interval
          clearInterval(intervalRef.current);
        }
      } else {
        clearInterval(intervalRef.current); 
      }
    }, interval);
  }, [setMessages]);

  useEffect(() => {
    if (!chatWs) return;
  
     chatWs.onmessage = (event) => {

      const data = JSON.parse(event.data.trim());
      console.log(data.message);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastIndex = updatedMessages.length - 1;
        if (updatedMessages[lastIndex].sender === "bot" && updatedMessages[lastIndex].loading) {
          updatedMessages[lastIndex].loading = false;
        }
        return updatedMessages;
      });
          simulateLiveGeneration(data.message);
        };
  
    chatWs.onerror = (err) => {
      console.error("Chat WebSocket error:", err);
    };
  
    return () => {
      chatWs.onmessage = null;
      chatWs.onerror = null;
    };
  }, [chatWs, simulateLiveGeneration, setMessages]);
  

  useEffect(() => {
    const scrollToBottom = debounce(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    scrollToBottom();
    return () => scrollToBottom.cancel();
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: uuidv4(), sender: "user", text: input },
    ]);

    setInput("");
    fetchResponse(input);
  };

  
  const fetchResponse = async (userInput) => {
    const controller = new AbortController();
    setAbortController(controller);

    setMessages((prev) => [
      ...prev,
      {
        id: uuidv4(),
        sender: "bot",
        text: "",
        loading: true,
      },
    ]);


    try {
      await fetch(
        `http://127.0.0.1:8000/chat?prompt=${encodeURIComponent(userInput)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        }
      );
    } catch (error) {
      console.error("Error sending prompt to /chat:", error);
    } finally {
      setAbortController(null);
    }
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
    }

    setMessages((prev) =>
      prev.filter((msg) => !(msg.sender === "bot" && msg.loading))
    );
  };

  return (
    <>
      <Toolbar />
      <ResponseModal
        isOpen={modalOpen}
        showModal={showModal}
        commandsInfo={modalCommandsInfo}
        setCommandsInfo={setModalCommandsInfo}
      />
      <div className="flex flex-col h-full relative">
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        <MessageInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          loading={messages.some((m) => m.sender === "bot" && m.loading)}
          handleStop={handleStop}
        />
      </div>
    </>
  );
};

export default Chatbot;
