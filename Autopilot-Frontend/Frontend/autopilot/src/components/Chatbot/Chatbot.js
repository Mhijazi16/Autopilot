import React, { useState, useEffect, useRef, useCallback } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { debounce } from "lodash";
import { v4 as uuidv4 } from "uuid";

import Toolbar from "./Toolbar/Toolbar";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ResponseModal from "./ResponseModal";

const Chatbot = ({ messages, setMessages, setNotifications }) => {
  const [modalOpen, showModal] = useState(false);
  const [modalCommandsInfo, setModalCommandsInfo] = useState("npm start");

  const [input, setInput] = useState("");
  const [abortController, setAbortController] = useState(null);

  const messagesEndRef = useRef(null);
  const intervalRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);


  const [localNotificationsQueue, setLocalNotificationsQueue] = useState([]);
  const [removalQueue, setRemovalQueue] = useState([]);
  const [clearAllNotifications, setClearAllNotifications] = useState(false);

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


  const scheduleNotificationRemoval = (notification, delay) => {
    setTimeout(() => {
      setRemovalQueue((prev) => [...prev, notification.id]);
    }, delay);
  };

  const queueNotification = useCallback((message, status) => {
    setLocalNotificationsQueue((prev) => [...prev, { message, status }]);
  }, []);

  useEffect(() => {
    if (localNotificationsQueue.length === 0) return;

    setNotifications((prev) => {
      let updatedNotifications = [...prev];

      localNotificationsQueue.forEach(({ message, status }) => {
        const now = Date.now();

        if (status === "finished" || status === "failed") {
          const runningIndex = updatedNotifications.findIndex(
            (notif) => notif.status === "running"
          );

          if (runningIndex !== -1) {
            updatedNotifications[runningIndex] = {
              ...updatedNotifications[runningIndex],
              message,
              status,
            };
            scheduleNotificationRemoval(
              updatedNotifications[runningIndex],
              4000
            );
            return;
          }
        }

        const newNotification = {
          id: now,
          message,
          status,
        };
        updatedNotifications.push(newNotification);

        if (status !== "running") {
          scheduleNotificationRemoval(newNotification, 5000);
        }
      });

      return updatedNotifications;
    });

    setLocalNotificationsQueue([]);
  }, [localNotificationsQueue, setNotifications]);

  useEffect(() => {
    if (removalQueue.length === 0) return;

    setNotifications((prev) =>
      prev.filter((notif) => !removalQueue.includes(notif.id))
    );
    setRemovalQueue([]);
  }, [removalQueue, setNotifications]);

  useEffect(() => {
    if (!clearAllNotifications) return;

    setNotifications([]);
    setClearAllNotifications(false);
  }, [clearAllNotifications, setNotifications]);

  const simulateLiveGeneration = useCallback(
    (message, onComplete) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setIsGenerating(true);

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
            clearInterval(intervalRef.current);
          }
        } else {
          clearInterval(intervalRef.current);
          setIsGenerating(false);
          if (onComplete) onComplete();
        }
      }, interval);
    },
    [setMessages]
  );

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

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsGenerating(false);

    setMessages((prev) =>
      prev.filter((msg) => !(msg.sender === "bot" && msg.loading))
    );
  };

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

    let wsNotifications;
    try {
      wsNotifications = new ReconnectingWebSocket(
        "ws://127.0.0.1:8000/notification"
      );

      wsNotifications.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (!data.status) return;

          console.log("Chatbot notification:", data.status);

          if (data.status === "running") {
            queueNotification("Job Running", "running");
          } else if (data.status === "finished") {
            queueNotification("Job Completed", "finished");
          } else if (data.status === "failed") {
            queueNotification("Job Failed", "failed");
          }
        } catch (err) {
          console.error("Error parsing Chatbot notification:", err);
        }
      };

      wsNotifications.onerror = (err) => {
        console.error("Chatbot notifications WebSocket error:", err);
      };

      await new Promise((resolve, reject) => {
        wsNotifications.onopen = () => {
          console.log("Chatbot notification socket connected.");
          resolve();
        };
        wsNotifications.onerror = (error) => {
          reject(error);
        };
      });

      const response = await fetch(
        `http://127.0.0.1:8000/chat?prompt=${encodeURIComponent(userInput)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data || !data.message) {
        throw new Error(
          "Invalid response format: 'message' property missing."
        );
      }

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (
          updated[lastIndex]?.sender === "bot" &&
          updated[lastIndex]?.loading
        ) {
          updated[lastIndex].loading = false;
        }
        return updated;
      });

      simulateLiveGeneration(data.message);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching response:", error);

        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (
            updated[lastIndex]?.sender === "bot" &&
            updated[lastIndex]?.loading
          ) {
            updated[lastIndex] = {
              ...updated[lastIndex],
              text: "",
              loading: false,
            };
          }
          return updated;
        });

        simulateLiveGeneration(
          "Oops! Something went wrong while fetching the response. Please try again."
        );
      }
    } finally {
      if (wsNotifications) {
        wsNotifications.close();
        console.log("Chatbot notification socket closed.");
      }
      setAbortController(null);
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
          loading={isGenerating}
          handleStop={handleStop}
        />
      </div>
    </>
  );
};

export default Chatbot;
