import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Chatbot from "./components/Chatbot/Chatbot";
import Dashboard from "./components/Dashboard/Dashboard";
import "./App.css";
import blueLightTop from './assets/blue-light-top.svg';
import Settings from "./components/Settings/Settings";

function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Chatbot />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/settings"
                element={<Settings theme={theme} setTheme={setTheme} />}
              />
            </Routes>
          </div>
        </div>
        {/* <div className="fade-overlay"></div> */}
        <div className="blue-light-top">
          <img src={blueLightTop} alt="blue-light" className="blue-light-pic"/>
        </div>
        <div className="blue-light-bottom"></div>
      </div>
    </Router>
  );
}

export default App;
