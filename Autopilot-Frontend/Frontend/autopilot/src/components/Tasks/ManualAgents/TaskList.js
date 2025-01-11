import React, { useState, useEffect, useRef } from "react";
import "./TaskList.css";
import DragAgent from "./DragAgent";
import defaultIcon from "../../../assets/icons/autopilot-button.png";

const TaskList = ({ 
  showModal, 
  taskId, 
  taskName, 
  commands, 
  updateTaskCommands, 
  updateTaskName, 
  isTaskRunning, 
  setSuccessMessage,
  successMessageShown,
  fetchTasks,
}) => {
  const [taskList, setTaskList] = useState(commands || []);
  const [pickerPosition, setPickerPosition] = useState(null);
  const [name, setName] = useState(taskName || "");
  const [isEditing, setIsEditing] = useState(false);

  const closePicker = () => setPickerPosition(null);

  const openPickerForAgent = (position) => {
    setPickerPosition(position);
  };

  const syncWithParent = (updatedArray) => {
    setTaskList(updatedArray);
    updateTaskCommands(updatedArray);
  };

  const updateAgent = (id, changes) => {
    if (changes.remove) {
      syncWithParent(taskList.filter((agent) => agent.id !== id));
    } else {
      const updated = taskList.map((agent) =>
        agent.id === id ? { ...agent, ...changes } : agent
      );
      syncWithParent(updated);
    }
  };

  const addtasksAgent = () => {
    const newId = Date.now();
    syncWithParent([
      ...taskList,
      {
        id: newId,
        text: "command",
        icon: defaultIcon,
        name: "default",
        status: "idle",
      },
    ]);
  };

  const moveItem = (fromIndex, toIndex) => {
    const updated = [...taskList];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    syncWithParent(updated);
  };

  const taskNameRef = useRef(name);

  useEffect(() => {
    if (taskNameRef.current !== name) {
      updateTaskName(name);
      taskNameRef.current = name;
    }
  }, [name, updateTaskName]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const saveName = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveName();
    }
  };

  const handleBlur = () => {
    saveName();
  };

  const handleSave = async () => {
    const payload = {
      id: taskId,
      name: name || "Task",
      commands: taskList
        .filter((cmd) => cmd.text !== "command" && cmd.text !== "" && cmd.icon !== defaultIcon)
        .map((cmd) => ({
          agent: cmd.name,
          task: cmd.text,
        })),
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      await fetchTasks();
      showModal(false);
      if (!successMessageShown.current) {
        setSuccessMessage("Task saved successfully!");
        successMessageShown.current = true;
      }
    } catch (err) {
      console.error("Error updating task:", err);
    } finally {
      setTimeout(() => {
        setSuccessMessage("");
        successMessageShown.current = false;
      }, 3000);
    }
  };

  const isAnyCommandActive = taskList.some(
    (cmd) => cmd.status === "pending" || cmd.status === "running" || cmd.status === "failed"
  );

  return (
    <div className="task-modal-overlay" onClick={() => showModal(false)}>
      <div
        className="task-modal-content"
        onClick={(e) => {
          e.stopPropagation();
          closePicker();
        }}
      >
        <div className="task-name-section">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              autoFocus
              className="task-name-input"
            />
          ) : (
            <div
              className="task-name-description"
              onClick={() => setIsEditing(true)}
            >
              {name || "Enter Task Name"}
            </div>
          )}
        </div>

        <div className="task-agents-list">
          {taskList.map((agent, index) => (
            <DragAgent
              key={agent.id}
              id={agent.id}
              text={agent.text}
              index={index}
              src={agent.icon}
              status={agent.status}
              moveItem={moveItem}
              updateAgent={updateAgent}
              openPickerForAgent={openPickerForAgent}
              closePicker={closePicker}
              pickerPosition={pickerPosition}
            />
          ))}
        </div>

        <div 
          className="task-agents-actions"
          style={{ display: isTaskRunning ? "none" : "flex" }}
        >
          <button
            className="add-agent-button"
            onClick={addtasksAgent}
            disabled={isAnyCommandActive || isTaskRunning}
          >
            +
          </button>
          <button
            className="save-task-button"
            onClick={handleSave}
            disabled={isAnyCommandActive || isTaskRunning}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
