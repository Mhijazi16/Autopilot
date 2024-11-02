// src/components/Sidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import autopilotLogo from '../assets/icons/autopilot-logo.png';
import autopilotButtonLogo from '../assets/icons/autopilot-button.png';
import dashboardLogo from '../assets/icons/home.png';
import monitoringLogo from '../assets/icons/monirotring.png';

const Sidebar = () => {
  return (
    <div className="sidebar flex flex-col p-8 space-y-8 shadow-xl">
      {/* Sidebar Title with Icon */}
      <h1 className="text-3xl font-bold text-blue-500 dark:text-blue-400 flex items-center space-x-3">
        <img src={autopilotLogo} alt="Autopilot Icon" className="h-10 w-10 no-filter" /> {/* Exclude from color change */}
        <span style={{color: '#003092'}}>Autopilot</span>
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
          <img src={autopilotButtonLogo} alt="Autopilot Button Icon" className="h-10 w-10" />
          <span className="text-lg font-medium">Autopilot</span>
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <img src={dashboardLogo} alt="Dashboard Icon" className="h-10 w-10" />
          <span className="text-lg font-medium">Dashboard</span>
        </NavLink>
        <NavLink
          to="/monitoring"
          className={({ isActive }) =>
            isActive ? 'sidebar-link active' : 'sidebar-link'
          }
        >
          <img src={monitoringLogo} alt="Monitoring Icon" className="h-10 w-10" />
          <span className="text-lg font-medium">Monitoring</span>
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
