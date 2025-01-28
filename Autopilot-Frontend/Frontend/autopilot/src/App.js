import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import Sidebar from "./components/Sidebar/Sidebar";
import Chatbot from "./components/Chatbot/Chatbot";
import Dashboard from "./components/Dashboard/Dashboard";
import Settings from "./components/Settings/Settings";
import Tasks from "./components/Tasks/Tasks";

import "./App.css";
import blueLightTop from "./assets/blue-light-top.svg";

function App() {
  const [runningTaskId, setRunningTaskId] = useState(null);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      return parsed.map((msg) => ({ ...msg, id: msg.id || uuidv4() }));
    }
    return [
      {
        id: uuidv4(),
        sender: "bot",
        text: "Hello! How can I assist you today?",
        loading: false,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const [taskNotificationStatus, setTaskNotificationStatus] = useState("");
  const [notifications, setNotifications] = useState([]);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />

        <div className="content">
          <div className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <Chatbot
                    messages={messages}
                    setMessages={setMessages}
                    setNotifications={setNotifications}
                  />
                }
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/tasks"
                element={
                  <Tasks
                    setNotifications={setNotifications}
                    setMessages={setMessages}
                    runningTaskId={runningTaskId}
                    setRunningTaskId={setRunningTaskId}
                  />
                }
              />
            </Routes>
          </div>
        </div>

        <div className="notification-message-container">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-message ${notification.status}`}
            >
              <div className="notification-message-icon">
                {notification.status === "running" && (
                  <span className="spinner-notif"></span>
                )}
                {notification.status === "finished" && <span className="icon">✔</span>}
                {notification.status === "failed" && <span className="icon">✖</span>}
              </div>
              <div>{notification.message}</div>
            </div>
          ))}
        </div>

        <div className="fade-overlay"></div>
        <div className="blue-light-top">
          <img src={blueLightTop} alt="blue-light" className="blue-light-pic" />
        </div>
        <div className="blue-light-bottom"></div>
      </div>
    </Router>
  );
}

export default App;
