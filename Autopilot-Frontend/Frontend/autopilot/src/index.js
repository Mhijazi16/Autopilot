// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Make sure this import is present
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
