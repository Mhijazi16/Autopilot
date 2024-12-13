import React from "react";
import "./AgentModal.css";

const AgentModal = ({ isOpen, onClose, name, icon, description }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-info">
            <h2 className="modal-title">{name}</h2>
            <h2>Agent</h2>
          </div>
          <div className="modal-icon">
            <img src={icon} alt={`${name} Icon`} />
          </div>
        </div>
        <hr className="modal-divider" />
        <div className="modal-body">
            {/* The {name} Agent is one of many agents supported in Autopilot. It's */}
            {/* responsible for any tasks related to search */}
            {description}
            {/* <br></br>
            <br></br>
            The following list represents the tools and actions that the
            navigation agent capable of doing:
            <br></br>
            <br></br>
          </p>
          <ul>
            <li>Search Youtube Videos Transcripts</li>
            <li>Search Google for information{name}</li>
            <li>Scraping web pages{name}</li>
          </ul>
          <br></br>
          <br></br>
          <p>
            The agent can be coupled with different agents to provide accurate
            information or missing information. */}
        </div>
      </div>
    </div>
  );
};

export default AgentModal;
