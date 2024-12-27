import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import packagerIcon from "../../../../assets/icons/packager.svg";
import navigationIcon from "../../../../assets/icons/navigation.png";
import databaseIcon from "../../../../assets/icons/database.png";
import shellIcon from "../../../../assets/icons/shell.png";
import networkIcon from "../../../../assets/icons/network.svg";
import codeIcon from "../../../../assets/icons/code.svg";
import githubIcon from "../../../../assets/icons/github.svg";
import troubleShootingIcon from "../../../../assets/icons/troubleshooting.svg";
import usersIcon from "../../../../assets/icons/users.svg";
import "./DragAgent.css"

const icons = [
    { src: databaseIcon, alt: "Database" },
    { src: shellIcon, alt: "Shell" },
    { src: packagerIcon, alt: "Packages" },
    { src: navigationIcon, alt: "Navigation" },
    { src: usersIcon, alt: "Users" },
    { src: codeIcon, alt: "Coder" },
    { src: networkIcon, alt: "Network" },
    { src: troubleShootingIcon, alt: "Troubleshooter" },
    { src: githubIcon, alt: "Github" },
  ];

  
  const DragAgent = ({
    id,
    text,
    index,
    src,
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
  
    const [, ref] = useDrag({
      type: ItemType,
      item: { id, index },
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
  
    const handleTextChange = (e) => setNewText(e.target.value);
  
    const saveText = (e) => {
      if (e.key === "Enter") {
        updateAgent(id, { text: newText });
        setIsEditing(false);
      }
    };
  
    const openIconPicker = (e) => {
      e.stopPropagation();
      const rect = dragAgentRef.current.getBoundingClientRect();
      openPickerForAgent({
        id,
        top: rect.top + window.scrollY + rect.height,
        left: rect.left + window.scrollX + 47,
      });
    };
  
    const selectIcon = (icon) => {
      updateAgent(id, { icon: icon.src, name: icon.alt });
      closePicker();
    };
  
    return (
      <div
        className="drag-agent"
        ref={(node) => {
          ref(drop(node));
          dragAgentRef.current = node;
        }}
      >
        <div className="blue-section">
            <div className="blue-section-dots"></div>
        </div>
        <div className="drag-agent-content">
          <div className="manual-agent-icon" onClick={openIconPicker}>
            <img src={src} alt={text} />
          </div>
          {pickerPosition?.id === id && (
            <div
              className="icon-picker"
              style={{
                top: pickerPosition.top,
                left: pickerPosition.left,
              }}
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
          <div className="manual-agent-description">
            {isEditing ? (
              <input
                type="text"
                value={newText}
                onChange={handleTextChange}
                onKeyDown={saveText}
                onBlur={() => setIsEditing(false)}
                autoFocus
              />
            ) : (
              <span onClick={() => setIsEditing(true)}>{text}</span>
            )}
          </div>
          <div className="delete-agent-button">
            <button onClick={() => updateAgent(id, { remove: true })}>-</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DragAgent;
  