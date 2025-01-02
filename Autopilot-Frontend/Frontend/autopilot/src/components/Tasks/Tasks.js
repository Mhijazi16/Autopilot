import React, { useState, useEffect } from "react";
import autopilotIcon from "../../assets/icons/autopilot.svg";
import "./Tasks.css";
import startButton from "../../assets/icons/start-button.svg";
import stopButton from "../../assets/icons/stop-button.svg";
import loadingButton from "../../assets/icons/autopilot-button.png";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskList from "./ManualAgents/TaskList";
import defaultIcon from "../../assets/icons/autopilot-button.png";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [currentModalTaskId, setCurrentModalTaskId] = useState(null);
  const [runningTaskId, setRunningTaskId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/tasks"); // GET /tasks
        const data = await response.json();
        
        const loadedTasks = data.map((task) => ({
          id: task.id, 
          name: task.name || `Untitled Task`,
          
          commands: (task.commands || []).map((cmd, j) => ({
            id: `${task.id}-cmd-${j}`,
            name: cmd.agent || "default",
            text: cmd.task || "command",
            icon: defaultIcon,
            status: "Idle"
          }))
        }));
        setTasks(loadedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const openModal = (taskId) => {
    setCurrentModalTaskId(taskId);
  };

  const closeModal = () => {
    setCurrentModalTaskId(null);
  };

  const startTask = async (task) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id
            ? {
                ...t,
                commands: t.commands.map((cmd) => ({
                  ...cmd,
                  status: "Pending",
                })),
              }
            : t
        )
      );

      const response = await fetch("http://127.0.0.1:8000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: task.name,
          commands: task.commands.map((cmd) => ({
            agent: cmd.name,
            task: cmd.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start task");
      }
      setRunningTaskId(task.id);

      openModal(task.id);

      const ws = new WebSocket("ws://127.0.0.1:8000/notification");
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Example of data: { id: 1, Task: "task1", status: "Running" or "Finished" }
        setTasks((prevTasks) =>
          prevTasks.map((t) => {
            if (t.id !== task.id) return t;
            return {
              ...t,
              commands: t.commands.map((cmd) => {
                // For simplicity, let's assume 'data.id' matches cmd.id or we update all
                // or we do partial matching by name
                if (cmd.name.toLowerCase() === (data.agent?.toLowerCase() || "")) {
                  // Update color based on data.status
                  if (data.status === "Running") {
                    return { ...cmd, status: "Running" };
                  } else if (data.status === "Finished") {
                    return { ...cmd, status: "Finished" };
                  }
                }
                return cmd;
              }),
            };
          })
        );
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
      };
    } catch (error) {
      console.error("Error starting task:", error);
    }
  };

  const stopTask = () => {
    setRunningTaskId(null);
  };

  const isDisabled = (taskId) =>
    runningTaskId !== null && runningTaskId !== taskId;

  const handleContainerClick = () => {
    setSelectedTaskId(null);
  };

  const handleTaskClick = (taskId, e) => {
    e.stopPropagation();
    setSelectedTaskId(taskId);
  };

  const handleAddTask = () => {
    const newTaskId = Date.now();
    const newTask = {
      id: newTaskId,
      name: `Task ${tasks.length + 1}`,
      commands: [
        {
          id: newTaskId + 1,
          name: "default",
          text: "command",
          icon: defaultIcon,
          status: "Idle",
        },
      ],
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTaskName = (taskId, newName) => {
    const sanitizedNewName = (newName || "").toString().trim();
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, name: sanitizedNewName } : task
      )
    );
  };

  const handleRemoveTaskRequest = (e) => {
    e.stopPropagation();
    if (selectedTaskId != null) {
      setShowDeleteConfirm(true);
    }
  };

  const handleConfirmDelete = () => {
    setTasks((prev) => prev.filter((task) => task.id !== selectedTaskId));
    setSelectedTaskId(null);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const updateTaskCommands = (taskId, updatedCommands) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? { ...t, commands: updatedCommands } : t))
    );
  };

  return (
    <>
      <div className={`delete-confirm-overlay ${showDeleteConfirm ? "show" : ""}`}>
        <div className="delete-confirm-modal">
          <p>Are you sure you want to delete this task?</p>
          <div className="delete-confirm-buttons">
            <button onClick={handleConfirmDelete}>Yes</button>
            <button onClick={handleCancelDelete}>No</button>
          </div>
        </div>
      </div>

      <div className="tasks-container" onClick={handleContainerClick}>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${selectedTaskId === task.id ? "task-selected" : ""}`}
            onClick={(e) => handleTaskClick(task.id, e)}
            onDoubleClick={() => openModal(task.id)}
          >
            <div className="task-icon">
              <img src={autopilotIcon} alt="Task Icon" />
            </div>
            <div className="task-text">{task.name}</div>
            <div className="task-controls">
              <button
                className="start-btn"
                onClick={() => {
                  startTask(task);
                }}
                disabled={isDisabled(task.id)}
              >
                <img
                  src={runningTaskId === task.id ? loadingButton : startButton}
                  alt="start button"
                />
              </button>
              <button
                className="stop-btn"
                onClick={stopTask}
                disabled={runningTaskId !== task.id}
              >
                <img src={stopButton} alt="stop button" />
              </button>
            </div>
          </div>
        ))}
        <div className="task-actions">
          <button className="add-btn" onClick={handleAddTask}>
            +
          </button>
          <button className="remove-btn" onClick={handleRemoveTaskRequest}>
            -
          </button>
        </div>

        {currentModalTaskId && (
          <DndProvider backend={HTML5Backend}>
            <TaskList
              showModal={closeModal}
              taskId={currentModalTaskId}
              taskName={tasks.find((t) => t.id == currentModalTaskId)?.name}
              commands={tasks.find((t) => t.id === currentModalTaskId)?.commands}
              updateTaskCommands={(updatedCommands) =>
                updateTaskCommands(currentModalTaskId, updatedCommands)
              }
              updateTaskName={(newName) => {
                console.log(
                  `updateTaskName called for taskId: ${currentModalTaskId} with newName: ${newName}`
                );
                updateTaskName(currentModalTaskId, newName);
              }}
            />
          </DndProvider>
        )}
      </div>
    </>
  );
};

export default Tasks;
