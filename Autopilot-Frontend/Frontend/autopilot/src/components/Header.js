// src/components/Header.js
import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = ({ onSearch }) => {
  return (
    <div className="flex items-center justify-between">
      <input
        type="text"
        placeholder="Search..."
        onChange={onSearch}
        className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <ThemeToggle />
    </div>
  );
};

export default Header;
