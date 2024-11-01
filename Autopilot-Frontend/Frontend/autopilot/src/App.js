// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chatbot from './components/Chatbot';
import Dashboard from './components/Dashboard';
import Monitoring from './components/Monitoring';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Apply the theme class to the html element
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleSearch = (e) => {
    // Implement search functionality within the current section
    console.log('Search query:', e.target.value);
  };

  return (
    <Router>
      <div>
        <Sidebar />
        <div className="content p-6 min-h-screen">
          <Header onSearch={handleSearch} theme={theme} setTheme={setTheme} />
          <div className="mt-6">
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
