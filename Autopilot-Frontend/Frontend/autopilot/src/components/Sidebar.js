// src/components/Sidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaCogs,
  FaTachometerAlt,
  FaChartLine,
  FaHeartbeat,
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar flex flex-col p-8 space-y-8 shadow-xl">
      {/* Sidebar Title with Icon */}
      <h1 className="text-3xl font-bold text-blue-500 dark:text-blue-400 flex items-center space-x-3">
        <FaCogs className="h-10 w-10" />
        <span>Autopilot</span>
      </h1>

      <nav className="space-y-6">
        {/* Links with icons */}
        <NavLink
          exact
          to="/"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <FaTachometerAlt className="h-8 w-8" />
          <span className="text-lg font-medium">Dashboard</span>
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <FaChartLine className="h-8 w-8" />
          <span className="text-lg font-medium">Autopilot</span>
        </NavLink>
        <NavLink
          to="/monitoring"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <FaHeartbeat className="h-8 w-8" />
          <span className="text-lg font-medium">Settings</span>
        </NavLink>
      </nav>

      {/* Footer text */}
      <p className="sidebar-footer text-xs">
        All rights go to Autopilot<br />
      </p>
    </div>
  );
};

export default Sidebar;
