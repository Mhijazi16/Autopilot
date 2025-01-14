import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket"; 
import Sidebar from "./components/Sidebar/Sidebar";
import Chatbot from "./components/Chatbot/Chatbot";
import Dashboard from "./components/Dashboard/Dashboard";
import "./App.css";
import blueLightTop from "./assets/blue-light-top.svg";
import Settings from "./components/Settings/Settings";
import Tasks from "./components/Tasks/Tasks";

function App() {
  const [theme, setTheme] = useState("dark");
  const [taskNotificationStatus, setTaskNotificationStatus] = useState("");
  const [notifications, setNotifications] = useState([]);

  const [chatWs, setChatWs] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const ws2 = new ReconnectingWebSocket("ws://127.0.0.1:8000/chat");
  
    setChatWs(ws2);
  
    ws2.onopen = () => {
      console.log("Chat WebSocket connection established.");
    };
  
    ws2.onerror = (err) => {
      console.error("Chat WebSocket error:", err);
    };
  
    return () => {
      console.log("Cleaning up WebSocket connection.");
      ws2.close();
    };
  }, [setChatWs]); 
  

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
                    chatWs={chatWs} 
                    setChatWs={setChatWs} 
                  />
                }
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/settings"
                element={<Settings theme={theme} setTheme={setTheme} />}
              />
              <Route
                path="/tasks"
                element={
                  <Tasks
                    setNotifications={setNotifications}
                    notifications={notifications}
                    setTaskNotificationStatus={setTaskNotificationStatus}
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
                {notification.status === "finished" && (
                  <span className="icon">✔</span>
                )}
                {notification.status === "failed" && (
                  <span className="icon">✖</span>
                )}
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
