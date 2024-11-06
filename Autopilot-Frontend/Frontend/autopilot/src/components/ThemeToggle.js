// src/components/ThemeToggle.js

import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle = ({ theme, setTheme }) => {
  const handleToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={handleToggle}
      className="theme-toggle-button"
    >
      {theme === 'light' ? (
        <MoonIcon className="icon" />
      ) : (
        <SunIcon className="icon" />
      )}
    </button>
  );
};

export default ThemeToggle;
