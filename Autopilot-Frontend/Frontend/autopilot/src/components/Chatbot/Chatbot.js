import React, { useState, useEffect, useRef } from "react";
import Toolbar from "../Toolbar/Toolbar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ResponseModal from "./ResponseModal";
import "./Chatbot.css";

const Chatbot = () => {

  const [modalOpen, setModalOpen] = useState(false);
  
  
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
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2",
          prompt: userInput,
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      if (response.headers.get("Content-Type") === "application/x-ndjson") {
        // Streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let botMessage = "";
        setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter(Boolean);

          for (const line of lines) {
            try {
              const json = JSON.parse(line);
              const text = json.response || json.choices?.[0]?.text || "";
              botMessage += text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].text = botMessage;
                return updated;
              });
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        }
      } else {
        const data = await response.json();
        const botResponse = data.response;
        setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
      }
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
      <button onClick={() => setModalOpen(true)} style={{color: "white"}}>Show modal</button>
      <ResponseModal isOpen={modalOpen} setModalOpen={setModalOpen}/>
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
