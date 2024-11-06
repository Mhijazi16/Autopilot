// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Chatbot from './components/Chatbot/Chatbot';
import Dashboard from './components/Dashboard/Dashboard';
import Monitoring from './components/Monitoring/Monitoring';
import './App.css'; // Import App-level styles

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleSearch = (e) => {
    console.log('Search query:', e.target.value);
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Header onSearch={handleSearch} theme={theme} setTheme={setTheme} />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Chatbot />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/monitoring" element={<Monitoring />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
