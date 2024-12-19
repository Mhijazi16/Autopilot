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
            {description}
        </div>
      </div>
    </div>
  );
};

export default AgentModal;
