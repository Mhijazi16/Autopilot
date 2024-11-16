import React from "react";
import "./ResponseModal.css";

const ResponseModal = ({ isOpen, setModalOpen, command }) => {
  if (!isOpen) return null;

  const handleClose = () => setModalOpen(false);

  return (
    <div className="modal-response-overlay" onClick={handleClose}>
      <div className="modal-response-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-response-desc">
        <p>The system is about to execute the following: 
            <br></br>
            "echo hello"
        </p>
        <p className="modal-command">{command}</p>
        </div>
        <div className="actions">
          <button id="approve-button">
            Approve
          </button>
          <button id="rethink-button">
            Rethink
          </button>
          <button id="reject-button">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;
