import React, { useState, useEffect, useRef, useCallback } from "react";
import Toolbar from "./Toolbar/Toolbar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ResponseModal from "./ResponseModal";
import "./Chatbot.css";
import { v4 as uuidv4 } from "uuid";
import ReconnectingWebSocket from "reconnecting-websocket";
import { debounce } from "lodash";

const Chatbot = ({ chatWs, setChatWs }) => {
  const [modalOpen, showModal] = useState(false);
  const [modalCommandsInfo, setModalCommandsInfo] = useState("npm start");

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
    return parsedMessages;
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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
          console.error("Error parsing WebSocket message:", error);
        }
      }
    };

    wsTools.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    wsTools.onclose = () => {
      console.log("WebSocket connection closed for tools.");
    };

    return () => {
      wsTools.close();
    };
  }, []);

  useEffect(() => {
    if (!chatWs) return;

    chatWs.onmessage = (event) => {
      const chunk = event.data.trim();
      console.log("Received chunk from WebSocket:", chunk);

      if (chunk) {
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastMessageIndex = updatedMessages.findIndex(
            (msg) => msg.sender === "bot" && msg.loading
          );

          if (lastMessageIndex !== -1) {
            simulateLiveGeneration(lastMessageIndex, chunk);
          } 
          else {
            updatedMessages.push({
              id: uuidv4(),
              sender: "bot",
              text: "",
              loading: true,
            });
            simulateLiveGeneration(updatedMessages.length - 1, chunk);
          }

          return updatedMessages;
        });
      }
    };

    chatWs.onerror = (err) => {
      console.error("Chat WebSocket error:", err);
    };

    return () => {
      // Don’t close chatWs globally unless you want to end the session
    };
  }, [chatWs]);

  // Auto-scroll to bottom when messages update
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

  // Persist messages to localStorage
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Helper: ensures there's a "loading" bot message if none exists
  const startBotMessageIfNeeded = () => {
    setMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      // If there's no lastMsg OR it's not a bot msg OR it's not loading
      if (!lastMsg || lastMsg.sender !== "bot" || !lastMsg.loading) {
        return [
          ...prev,
          { id: uuidv4(), sender: "bot", text: "", loading: true },
        ];
      }
      return prev;
    });
  };

  // User pressed "send"
  const handleSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!input.trim()) return;

    // Show user’s message
    setMessages((prev) => [
      ...prev,
      { id: uuidv4(), sender: "user", text: input },
    ]);

    setInput("");

    fetchResponse(input);
  };

  // POST the prompt to /chat, AI output arrives via chatWs
  const fetchResponse = async (userInput) => {
    const controller = new AbortController();
    setAbortController(controller);

    // Immediately add a loading bot message
    setMessages((prev) => [
      ...prev,
      { id: uuidv4(), sender: "bot", text: "", loading: true },
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

  const simulateLiveGeneration = useCallback((messageIndex, chunk) => {
    // Clear any existing interval to avoid overlaps
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  
    let currentIndex = 0;
    const sanitizedChunk = chunk.trim(); // Sanitize input to avoid whitespace issues
    const interval = 20; // Typing speed
  
    intervalRef.current = setInterval(() => {
      if (currentIndex < sanitizedChunk.length) {
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const target = updatedMessages[messageIndex];
          if (target && target.sender === "bot") {
            updatedMessages[messageIndex] = {
              ...target,
              text: target.text + sanitizedChunk[currentIndex],
            };
          }
          return updatedMessages;
        });
        currentIndex++;
      } else {
        clearInterval(intervalRef.current);
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const target = updatedMessages[messageIndex];
          if (target && target.loading) {
            updatedMessages[messageIndex] = {
              ...target,
              loading: false, 
            };
          }
          return updatedMessages;
        });
      }
    }, interval);
  }, []);
  

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setLoading(false);
      setMessages((prevMessages) =>
        prevMessages.filter(
          (msg) => !(msg.sender === "bot" && msg.loading)
        )
      );
    }
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
          loading={loading}
          handleStop={handleStop}
        />
      </div>
    </>
  );
};

export default Chatbot;
