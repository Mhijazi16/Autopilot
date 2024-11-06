// src/components/Header.js

import React from 'react';
import ThemeToggle from '../ThemeToggle';
import './Header.css';

const Header = ({ onSearch, theme, setTheme }) => {
  return (
    <div className="header">
      <div className="header-left"></div>
      <div className="header-right">
        <input
          type="text"
          placeholder="Search..."
          onChange={onSearch}
          className="search-input"
        />
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </div>
  );
};

export default Header;
