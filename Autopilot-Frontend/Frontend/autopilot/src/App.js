// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chatbot from './components/Chatbot';
import Dashboard from './components/Dashboard';
import Monitoring from './components/Monitoring';

function App() {
  const handleSearch = (e) => {
    // Implement search functionality within the current section
    console.log('Search query:', e.target.value);
  };

  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
          <Header onSearch={handleSearch} />
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
