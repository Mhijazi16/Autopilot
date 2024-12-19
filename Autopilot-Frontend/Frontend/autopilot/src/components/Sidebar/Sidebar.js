import React from "react";
import { NavLink } from "react-router-dom";
import autopilotLogo from "../../assets/icons/autopilot-logo.svg";
import autopilotButtonLogo from "../../assets/icons/autopilot-button.png";
import dashboardLogo from "../../assets/icons/home.png";
import settingsLogo from "../../assets/icons/settings.svg";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h1 className="sidebar-title">
        <img src={autopilotLogo} alt="Autopilot Icon" className="logo" />
        <span>Autopilot</span>
      </h1>

      <nav className="nav-links">
        <NavLink to="/dashboard" className="sidebar-link">
          <img src={dashboardLogo} alt="Dashboard Icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/" className="sidebar-link">
          <img src={autopilotButtonLogo} alt="Autopilot Button Icon" />
          <span>Autopilot</span>
        </NavLink>
        <NavLink to="/settings" className="sidebar-link">
          <img src={settingsLogo} alt="Settings Icon" />
          <span>Settings</span>
        </NavLink>
      </nav>

      <p className="sidebar-footer">
        All rights go to Autopilot
        <br />
      </p>
    </div>
  );
};

export default Sidebar;
