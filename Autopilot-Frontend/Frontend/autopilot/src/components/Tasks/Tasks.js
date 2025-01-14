import React, { useState, useEffect, useCallback, useRef } from "react";
import autopilotIcon from "../../assets/icons/autopilot.svg";
import "./Tasks.css";
import startButton from "../../assets/icons/start-button.svg";
import stopButton from "../../assets/icons/stop-button.svg";
import loadingButton from "../../assets/icons/autopilot-button.png";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskList from "./ManualAgents/TaskList";
import defaultIcon from "../../assets/icons/autopilot-button.png";

const Tasks = ({
  setNotificationMessage,
  setNotifications,
}) => {
  const [tasks, setTasks] = useState([]);
  const [currentModalTaskId, setCurrentModalTaskId] = useState(null);
  const [runningTaskId, setRunningTaskId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ws, setWs] = useState(null);
  const [generateTaskModal, showGenerateTaskModal] = useState(false);
  const [generateTaskPrompt, setGenerateTaskPrompt] = useState(""); 
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const successMessageShown = useRef(false);

  const mapTasks = useCallback((data) => {
    const loadedTasks = data.map((task) => ({
      id: task.id,
      name: task.name || `Untitled Task`,
      commands: (task.commands || []).map((cmd, j) => ({
        id: `${task.id}-cmd-${j}`,
        name: cmd.agent || "default",
        text: cmd.task || "command",
        icon: cmd.agent,
        status: "idle",
      })),
    }));
    setTasks(loadedTasks);
  }, [setTasks]);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      mapTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [mapTasks]); 

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openModal = (taskId) => {
    setCurrentModalTaskId(taskId);
  };

  const closeModal = () => {
    setCurrentModalTaskId(null);
  };

  const startTask = async (task) => {

    if(task.id === -1) 
    {
      setSuccessMessage("Task not saved!");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }
    try {
      setRunningTaskId(task.id);
  
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id
            ? {
                ...t,
                commands: t.commands.map((cmd) => ({
                  ...cmd,
                  status: "pending",
                })),
              }
            : t
        )
      );
      
  
      const newWs = new WebSocket("ws://127.0.0.1:8000/notification");
      setWs(newWs);
      openModal(task.id);
      
      newWs.onopen = async () => {
        console.log("WebSocket connected for notifications.");
  
        try {
          const response = await fetch(`http://127.0.0.1:8000/tasks/${task.id}/start`, {
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
            setRunningTaskId(null); 
            throw new Error("Failed to start task");
          }
  
        } catch (fetchError) {
          console.error("Error sending task start request:", fetchError);
          newWs.close();
          setRunningTaskId(null); 
        }
      };
  
      newWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(data);
          if (!data.status) return;
      
          setTasks((prevTasks) =>
            prevTasks.map((t) => {
              if (t.id !== task.id) return t;
      
              let updatedCommands = [...t.commands];
              const firstPendingIndex = updatedCommands.findIndex(
                (cmd) => cmd.status === "pending"
              );
      
              if (data.status === "running" && firstPendingIndex !== -1) {
                updatedCommands[firstPendingIndex].status = "running";
                updateNotification("Job Running", "running");
                                
              } else if (data.status === "finished") {
                updateNotification("Job Completed", "finished");
                const firstRunningIndex = updatedCommands.findIndex(
                  (cmd) => cmd.status === "running"
                );

                if (firstRunningIndex !== -1) {
                  updatedCommands[firstRunningIndex].status = "finished";
                }

              } else if (data.status === "failed") {
                updateNotification("Job Failed", "failed");
                const firstRunningIndex = updatedCommands.findIndex(
                  (cmd) => cmd.status === "running"
                );

                if (firstRunningIndex !== -1) {
                  updatedCommands[firstRunningIndex].status = "failed";
                }
              }
      
              const allFinished = updatedCommands.every(
                (cmd) => cmd.status === "finished" || cmd.status === "failed"
              );
      
              if (allFinished) {
                updatedCommands = updatedCommands.map((cmd) => ({
                  ...cmd,
                  status: "idle",
                }));
                setRunningTaskId(null);
                console.log("All commands finished, resetting to idle");
              }
      
              return { ...t, commands: updatedCommands };
            })
          );
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };
      
      
  
      newWs.onclose = () => {
        console.log("WebSocket closed for notifications");
      };
    } catch (error) {
      console.error("Error starting task:", error);
      setRunningTaskId(null);
    }
  };
  
  const updateNotification = (message, status) => {
    setNotifications((prevNotifications) => {
      const now = Date.now();
  
      // If we're marking a "running" notification as "finished" or "failed", find the first "running"
      if (status === "finished" || status === "failed") {
        const runningIndex = prevNotifications.findIndex(
            (notif) => notif.status === "running"
        );
  
        // If found, update that "running" notification instead of adding a new one
        if (runningIndex !== -1) {
          const updatedNotifications = [...prevNotifications];
          updatedNotifications[runningIndex] = {
            ...updatedNotifications[runningIndex],
            message, 
            status
          };
  
          // Schedule removal for 4s
          setTimeout(() => {
            setNotifications((current) =>
              current.filter(
                (n) => n !== updatedNotifications[runningIndex]
              )
            );
          }, 4000);
  
          return updatedNotifications;
        }
      }
  
      const newNotification = {
        id: now,
        message,
        status
      };
      const updatedNotifications = [...prevNotifications, newNotification];
  
      // Remove after 4s if not "running"
      if (status !== "running") {
        setTimeout(() => {
          setNotifications((current) =>
            current.filter((n) => n.id !== now)
          );
        }, 5000);
      }
  
      return updatedNotifications;
    });
  };
  
  
  

  const stopTask = async (task) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/tasks/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to stop the task");
      }

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id
            ? {
                ...t,
                commands: t.commands.map((cmd) => ({
                  ...cmd,
                  status: "idle",
                })),
              }
            : t
        )
      );

      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notif) =>
            !task.commands.some(
              (cmd) => cmd.name === notif.message && notif.status === "running"
            )
        )
      );
      
      setRunningTaskId(null);

      if (ws) {
        ws.close();
        setWs(null);
      }

      console.log("Task stopped successfully");
    } catch (error) {
      console.error("Error stopping the task:", error);
    }
  };

  const isDisabled = () => runningTaskId !== null;

  const handleContainerClick = () => {
    setSelectedTaskId(null);
  };
  const handleTaskClick = (taskId, e) => {
    e.stopPropagation();
    setSelectedTaskId(taskId);
  };

  const handleAddTask = () => {
    const newTaskId = -1;
    const newTask = {
      id: newTaskId,
      name: `Task Name`,
      commands: [
        {
          id: newTaskId + 1,
          name: "default",
          text: "command",
          icon: defaultIcon,
          status: "idle",
        },
      ],
    };
    setCurrentModalTaskId(newTaskId);
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
  const handleConfirmDelete = async () => {
    if(selectedTaskId === -1) {
      setSuccessMessage("Task not saved!");
      setShowDeleteConfirm(false);
      setSelectedTaskId(null);
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:8000/tasks/${selectedTaskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedTasks = await response.json();
        mapTasks(updatedTasks);
      } else {
        console.error("Failed to delete the task");
      }
    } catch (error) {
      console.error("Error deleting the task:", error);
    } finally {
      setSelectedTaskId(null);
      setShowDeleteConfirm(false);
    }
  };
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const updateTaskCommands = (taskId, updatedCommands) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? { ...t, commands: updatedCommands } : t))
    );
  };

  const handleGenerateTask = async () => {
    if (generateTaskPrompt.length < 5) return;
    setLoading(true); 
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-task/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: generateTaskPrompt }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate task");
      }
  
      await fetchTasks();
  
      if (!successMessageShown.current) {
        setSuccessMessage("Task generated successfully!");
        successMessageShown.current = true; 
        setTimeout(() => setSuccessMessage(""), 3000);
      }
  
      showGenerateTaskModal(false);
  
      setGenerateTaskPrompt("");
    } catch (error) {
      console.error("Error generating task:", error);
    } finally {
      setLoading(false); 
      setTimeout(() => setSuccessMessage(""), 3000);
      successMessageShown.current = false;
    }
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
                onClick={() => startTask(task)}
                disabled={isDisabled()}
              >
                <img
                  src={runningTaskId === task.id ? loadingButton : startButton}
                  alt="start button"
                />
              </button>
              <button
                className="stop-btn"
                onClick={() => stopTask(task)}
                disabled={runningTaskId !== task.id}
              >
                <img src={stopButton} alt="stop button" />
              </button>
            </div>
          </div>
        ))}
        <div className="task-actions">
          <button className="task-generate-button" onClick={() => showGenerateTaskModal(true)}>generate task</button>
          <button className="add-btn" onClick={handleAddTask} disabled={isDisabled()}>new task</button>
          <button className="remove-btn" onClick={handleRemoveTaskRequest}>remove task</button>
        </div>
        {generateTaskModal && (
          <div className="generate-task-modal" onClick={() => showGenerateTaskModal(false)}>
            <div className="generate-task-input" onClick={(e) => e.stopPropagation()}>
            <textarea
              value={generateTaskPrompt}
              onChange={(e) => setGenerateTaskPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
            ></textarea>
            {loading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            ) : (
              <button
                onClick={handleGenerateTask}
                disabled={loading}
                style={{ backgroundColor: loading ? "#ccc" : "#004de6" }}
              >
                Generate
              </button>
            )}
          </div>
          </div>
        )}

        {successMessage && <div className="success-message">{successMessage}</div>}

        {currentModalTaskId && (
          <DndProvider backend={HTML5Backend}>
            <TaskList
              showModal={closeModal}
              taskId={currentModalTaskId}
              taskName={tasks.find((t) => t.id === currentModalTaskId)?.name}
              commands={tasks.find((t) => t.id === currentModalTaskId)?.commands}
              updateTaskCommands={(updatedCommands) =>
                updateTaskCommands(currentModalTaskId, updatedCommands)
              }
              updateTaskName={(newName) => {
                updateTaskName(currentModalTaskId, newName);
              }}
              isTaskRunning={runningTaskId === currentModalTaskId}
              setSuccessMessage={setSuccessMessage}
              successMessageShown={successMessageShown}
              fetchTasks={fetchTasks}
            />
          </DndProvider>
        )}
      </div>
    </>
  );
};

export default Tasks;
