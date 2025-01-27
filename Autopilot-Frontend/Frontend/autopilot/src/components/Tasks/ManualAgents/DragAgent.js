import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import Packages from "../../../assets/icons/packager.svg";
// import Navigation from "../../../assets/icons/navigation.png";
import Process from "../../../assets/icons/processes.svg";
import Shell from "../../../assets/icons/shell.png";
import Network from "../../../assets/icons/network.svg";
import Coder from "../../../assets/icons/code.svg";
import Github from "../../../assets/icons/github.svg";
import Filesystem from "../../../assets/icons/filesystem.svg";
import Users from "../../../assets/icons/users.svg";
import defaultIcon from "../../../assets/icons/autopilot-button.png";
import "./DragAgent.css";

const icons = [
  { src: Process, alt: "Process" },
  { src: Shell, alt: "Shell" },
  { src: Packages, alt: "Packages" },
  // { src: Navigation, alt: "Navigation" },
  { src: Users, alt: "Users" },
  { src: Coder, alt: "Coder" },
  { src: Network, alt: "Network" },
  { src: Filesystem, alt: "Filesystem" },
  { src: Github, alt: "Github" },
];

const DragAgent = ({
  id,
  text,
  index,
  src,
  status,
  moveItem,
  updateAgent,
  openPickerForAgent,
  closePicker,
  pickerPosition,
}) => {
  const ItemType = "ITEM";
  const dragAgentRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(text);
  const resolvedIcon =
    icons.find((icon) => icon.alt === src)?.src || defaultIcon;

  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType,
    item: { id, index },
    canDrag: status === "idle", 
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const handleTextChange = (e) => {
    setNewText(e.target.value);
  };

  const saveText = () => {
    updateAgent(id, { text: newText });
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveText();
    }
  };

  const handleBlur = () => {
    saveText();
  };

  const openIconPicker = (e) => {
    e.stopPropagation();
    const rect = dragAgentRef.current.getBoundingClientRect();
    openPickerForAgent({
      id,
      top: rect.top  + rect.height,
      left: rect.left + 47,
    });
  };

  const selectIcon = (icon) => {
    updateAgent(id, { icon: icon.alt, name: icon.alt });
    closePicker();
  };

  const getButtonSymbol = () => {
    switch (status) {
      case "running":
        return ""; 
      case "finished":
        return "✔";
      case "pending":
        return "";
      case "failed":
        return "✖";
      default:
        return "-";
    }
  };

  const getButtonStyle = () => {
    switch (status) {
      case "running":
        return { backgroundColor: "#007bff" };
      case "finished":
        return { backgroundColor: "#198754" };
      case "pending":
        return { backgroundColor: "#D3D3D3" };
      case "failed": 
        return { backgroundColor: "#dc3545" };
      default:
        return { backgroundColor: "#dc3545" };
    }
  };

  return (
    <div
      className={`drag-agent ${status}`}
      ref={(node) => {
        dragRef(drop(node));
        dragAgentRef.current = node;
      }}
    >
      <div className={`blue-section ${status}`}>
        <div className="blue-section-dots"></div>
      </div>
      <div className="drag-agent-content">
        <div className={`task-agent-icon ${status.toLowerCase()}`} onClick={openIconPicker}>
          <img src={resolvedIcon} alt={text} />
        </div>
        {pickerPosition?.id === id && (
          <div
            className="icon-picker"
            style={{ top: pickerPosition.top, left: pickerPosition.left }}
          >
            {icons.map((icon) => (
              <img
                key={icon.alt}
                src={icon.src}
                alt={icon.alt}
                onClick={() => selectIcon(icon)}
                className="icon-option"
              />
            ))}
          </div>
        )}
        <div className={`task-agent-description ${status.toLowerCase()}`}>
          {isEditing ? (
            <input
              type="text"
              value={newText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              autoFocus
            />
          ) : (
            <span onClick={() => setIsEditing(true)}> {text || "Enter command..."}</span>
          )}
        </div>
        <div className="delete-agent-button">
          <button
            style={getButtonStyle()}
            onClick={() => updateAgent(id, { remove: true })}
            disabled={status !== "idle"}
          >
            {status === "running" && <span className="spinner"></span>}
            {getButtonSymbol()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DragAgent;
