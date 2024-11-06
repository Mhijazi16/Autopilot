// src/components/Sidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import autopilotLogo from '../../assets/icons/autopilot-logo.png';
import autopilotButtonLogo from '../../assets/icons/autopilot-button.png';
import dashboardLogo from '../../assets/icons/home.png';
import monitoringLogo from '../../assets/icons/monitoring.png';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Sidebar Title with Icon */}
      <h1 className="sidebar-title">
        <img src={autopilotLogo} alt="Autopilot Icon" className="logo" />
        <span>Autopilot</span>
      </h1>

      <nav className="nav-links">
        {/* Links with icons */}
        <NavLink to="/" className="sidebar-link">
          <img src={autopilotButtonLogo} alt="Autopilot Button Icon" />
          <span>Autopilot</span>
        </NavLink>
        <NavLink to="/dashboard" className="sidebar-link">
          <img src={dashboardLogo} alt="Dashboard Icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/monitoring" className="sidebar-link">
          <img src={monitoringLogo} alt="Monitoring Icon" />
          <span>Monitoring</span>
        </NavLink>
      </nav>

      {/* Footer text */}
      <p className="sidebar-footer">
        All rights go to Autopilot<br />
      </p>
    </div>
  );
};

export default Sidebar;
