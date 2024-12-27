import React, { useState } from "react";
import "./ManualAgents.css";
import DragAgent from "./DragAgent";
import defaultIcon from "../../../../assets/icons/autopilot-button.png";

const ManualAgents = ({ manualAgents, setManualAgents, showModal, startManualAgents }) => {
  const [pickerPosition, setPickerPosition] = useState(null);

  const closePicker = () => setPickerPosition(null);
  const openPickerForAgent = (position) => {
    setPickerPosition(position);
  };

  const updateAgent = (id, changes) => {
    setManualAgents((prev) =>
      changes.remove
        ? prev.filter((agent) => agent.id !== id)
        : prev.map((agent) => (agent.id === id ? { ...agent, ...changes } : agent))
    );
  };

  const addManualAgent = () => {
    setManualAgents((prev) => [
      ...prev,
      { id: Date.now(), text: "command", icon: defaultIcon },
    ]);
  };

  const moveItem = (fromIndex, toIndex) => {
    setManualAgents((prev) => {
      const updated = [...prev];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);
      return updated;
    });
  };

  return (
    <div
      className="manual-modal-overlay"
      onClick={() => showModal(false)}
    >
      <div
        className="manual-modal-content"
        onClick={(e) => {
          e.stopPropagation();
          closePicker();
        }}
      >
        <div className="manual-agents-list">
          {manualAgents.map((agent, index) => (
            <DragAgent
              key={agent.id}
              id={agent.id}
              text={agent.text}
              index={index}
              src={agent.icon}
              moveItem={moveItem}
              updateAgent={updateAgent}
              openPickerForAgent={openPickerForAgent}
              closePicker={closePicker}
              pickerPosition={pickerPosition}
            />
          ))}
        </div>
        <div className="manual-agents-actions">
          <button className="add-agent-button" onClick={addManualAgent}>+</button>
          <button className="start-agents-button" onClick={startManualAgents}>Start</button>
        </div>
      </div>
    </div>
  );
};

export default ManualAgents;
