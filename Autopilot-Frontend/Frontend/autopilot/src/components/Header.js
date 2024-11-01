// src/components/Header.js

import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = ({ onSearch, theme, setTheme }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          onChange={onSearch}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </div>
  );
};

export default Header;
