import React from "react";
import "./ResponseModal.css";

const ResponseModal = ({ isOpen, showModal, commandsInfo, setCommandsInfo }) => {
  if (!isOpen) return null;


  async function reject() {
    try {
      const response = await fetch("http://127.0.0.1:8000/reject", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        setCommandsInfo(" ");
        showModal(false);
      } else {
        console.log(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.log("Error sending rejection:", error);
    }
  }
  
  async function approve() {
    try {
      const response = await fetch("http://127.0.0.1:8000/accept", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        setCommandsInfo(" ");
        showModal(false);
      } else {
        console.log(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.log("Error sending approval:", error);
    }
  }
  

  return (
    <div className="modal-response-overlay">
      <div className="modal-response-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-response-desc">
        <p>The system is about to execute the following: 
        </p>
        <p className="modal-command">{commandsInfo}</p>
        </div>
        <div className="actions">
          <button id="approve-button" onClick={approve}>
            Approve
          </button>
          <button id="reject-button" onClick={reject}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;
