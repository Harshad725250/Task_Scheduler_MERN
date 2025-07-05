// src/pages/TasksPage.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import TaskItem from "../components/TaskItem";
import { format, parseISO, isPast } from "date-fns";

import "../Dashboard.css";
const PlusIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const LogOutIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
);

export default function TasksPage() {
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [alertedReminders, setAlertedReminders] = useState(() => {
    const storedAlerts = sessionStorage.getItem("alertedReminders");
    return storedAlerts ? new Set(JSON.parse(storedAlerts)) : new Set();
  });

  const [taskFormData, setTaskFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    reminder: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const API_URL = "http://localhost:5000/api/tasks/";

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        setLoadingTasks(true);
        setError("");
        try {
          const res = await axios.get(API_URL);
          setTasks(res.data);
        } catch (err) {
          console.error(
            "Error fetching tasks:",
            err.response?.data?.message || err.message
          );
          if (err.response?.status === 401 || err.response?.status === 403) {
            logout();
            navigate("/login");
            setError("Session expired or unauthorized. Please log in again.");
          } else {
            setError("Failed to fetch tasks.");
          }
        } finally {
          setLoadingTasks(false);
        }
      }
    };

    fetchTasks();
  }, [user, logout, navigate]);

  useEffect(() => {
    const checkReminders = () => {
      if (tasks.length > 0) {
        const newAlerts = new Set(alertedReminders);

        tasks.forEach((task) => {
          if (task.reminder && !task.completed) {
            const reminderDate = parseISO(task.reminder);
            if (isPast(reminderDate) && !newAlerts.has(task._id)) {
              window.alert(
                `Reminder: Your task "${task.title}" is due!\nDue: ${format(
                  reminderDate,
                  "PPpp"
                )}`
              );
              newAlerts.add(task._id);
            }
          }
        });

        if (newAlerts.size !== alertedReminders.size) {
          setAlertedReminders(newAlerts);
          // --- FIXED TYPO HERE: newAlerters -> newAlerts ---
          sessionStorage.setItem(
            "alertedReminders",
            JSON.stringify(Array.from(newAlerts))
          );
        }
      }
    };

    const reminderInterval = setInterval(checkReminders, 10 * 1000);

    return () => clearInterval(reminderInterval);
  }, [tasks, alertedReminders]);

  const handleFormChange = (e) => {
    setTaskFormData({ ...taskFormData, [e.target.name]: e.target.value });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!taskFormData.title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    try {
      let res;
      if (isEditing && currentTaskId) {
        res = await axios.put(`${API_URL}${currentTaskId}`, taskFormData);
        setTasks(
          tasks.map((task) => (task._id === currentTaskId ? res.data : task))
        );
        setSuccessMessage("Task updated successfully!");

        setAlertedReminders((prev) => {
          const newSet = new Set(prev);
          newSet.delete(currentTaskId);
          if (
            taskFormData.reminder &&
            isPast(parseISO(taskFormData.reminder))
          ) {
            newSet.add(res.data._id);
          }
          sessionStorage.setItem(
            "alertedReminders",
            JSON.stringify(Array.from(newSet))
          );
          return newSet;
        });
      } else {
        res = await axios.post(API_URL, taskFormData);
        setTasks([res.data, ...tasks]);
        setSuccessMessage("Task created successfully!");

        if (taskFormData.reminder && isPast(parseISO(taskFormData.reminder))) {
          setAlertedReminders((prev) => {
            const newSet = new Set(prev);
            newSet.add(res.data._id);
            sessionStorage.setItem(
              "alertedReminders",
              JSON.stringify(Array.from(newSet))
            );
            return newSet;
          });
        }
      }

      setTaskFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        reminder: "",
      });
      setIsEditing(false);
      setCurrentTaskId(null);
    } catch (err) {
      console.error(
        "Error saving task:",
        err.response?.data?.message || err.message
      );
      setError(
        `Failed to save task: ${err.response?.data?.message || "Unknown error"}`
      );
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate("/login");
        setError("Session expired or unauthorized. Please log in again.");
      }
    }
  };

  const handleEditTask = (task) => {
    setTaskFormData({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? format(parseISO(task.dueDate), "yyyy-MM-dd") : "",
      priority: task.priority,
      reminder: task.reminder
        ? format(parseISO(task.reminder), "yyyy-MM-dd'T'HH:mm")
        : "",
    });
    setIsEditing(true);
    setCurrentTaskId(task._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setError("");
      setSuccessMessage("");
      try {
        await axios.delete(`${API_URL}${id}`);
        setTasks(tasks.filter((task) => task._id !== id));
        setSuccessMessage("Task deleted successfully!");
        setAlertedReminders((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          sessionStorage.setItem(
            "alertedReminders",
            JSON.stringify(Array.from(newSet))
          );
          return newSet;
        });
      } catch (err) {
        console.error(
          "Error deleting task:",
          err.response?.data?.message || err.message
        );
        setError("Failed to delete task.");
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate("/login");
          setError("Session expired or unauthorized. Please log in again.");
        }
      }
    }
  };

  const handleToggleComplete = async (id) => {
    setError("");
    setSuccessMessage("");
    try {
      const res = await axios.put(`${API_URL}${id}/complete`);
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
      setSuccessMessage("Task status updated!");
      if (res.data.completed) {
        setAlertedReminders((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          sessionStorage.setItem(
            "alertedReminders",
            JSON.stringify(Array.from(newSet))
          );
          return newSet;
        });
      }
    } catch (err) {
      console.error(
        "Error toggling task completion:",
        err.response?.data?.message || err.message
      );
      setError("Failed to update task status.");
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate("/login");
        setError("Session expired or unauthorized. Please log in again.");
      }
    }
  };

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="loading-content">
            <div className="spinner"></div>
            <span>Loading user data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Animated Background */}
      <div className="dashboard-bg">
        <div className="bg-decoration">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
          <div className="floating-shape shape-5"></div>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <h1 className="dashboard-title">
                Welcome back{" "}
                <span className="user-name">
                  {user ? user.username : "Guest"}
                </span>
              </h1>
              <p className="dashboard-subtitle">
                Manage your tasks and boost your productivity
              </p>
            </div>
            <button
              className="logout-btn"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOutIcon />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Display Success/Error Messages */}
        {error && (
          <div className="task-form-card">
            <div className="error-alert">
              <AlertCircleIcon />
              <span>{error}</span>
            </div>
          </div>
        )}
        {successMessage && (
          <div className="task-form-card">
            <div className="success-alert">
              <CheckCircleIcon />
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Add New Task Form */}
        <div className="task-form-card">
          <div className="card-glow"></div>
          <div className="form-header">
            <PlusIcon />
            <h2 className="form-title">
              {isEditing ? "Edit Task" : "Add New Task"}
            </h2>
          </div>
          <form onSubmit={handleTaskSubmit} className="task-form">
            <div className="form-group">
              <label className="form-label">Title</label>
              <div className="input-container">
                <input
                  type="text"
                  name="title"
                  value={taskFormData.title}
                  onChange={handleFormChange}
                  placeholder="Enter task title..."
                  className="form-input"
                  required
                />
                <div className="input-glow"></div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <div className="input-container">
                <textarea
                  name="description"
                  value={taskFormData.description}
                  onChange={handleFormChange}
                  placeholder="Add task description..."
                  className="form-textarea"
                  rows="3"
                ></textarea>
                <div className="input-glow"></div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Due Date (Optional)</label>
                <div className="input-container">
                  <input
                    type="date"
                    name="dueDate"
                    value={taskFormData.dueDate}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                  <div className="input-glow"></div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reminder (Optional)</label>
                <div className="input-container">
                  <input
                    type="datetime-local"
                    name="reminder"
                    value={taskFormData.reminder}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                  <div className="input-glow"></div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <div className="input-container">
                <select
                  name="priority"
                  value={taskFormData.priority}
                  onChange={handleFormChange}
                  className="form-select"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
                <div className="input-glow"></div>
              </div>
            </div>

            <button type="submit" className="add-task-btn">
              <div className="button-bg"></div>
              <div className="button-content">
                <PlusIcon />
                <span>{isEditing ? "Update Task" : "Add Task"}</span>
                <div className="button-arrow">→</div>
              </div>
            </button>
            {isEditing && (
              <button
                type="button"
                className="add-task-btn"
                style={{
                  marginTop: "10px",
                  background: "linear-gradient(135deg, #6b7280, #4b5563)",
                }}
                onClick={() => {
                  setIsEditing(false);
                  setCurrentTaskId(null);
                  setTaskFormData({
                    title: "",
                    description: "",
                    dueDate: "",
                    priority: "Medium",
                    reminder: "",
                  });
                }}
              >
                <div className="button-bg"></div>
                <div className="button-content">
                  <span>Cancel Edit</span>
                </div>
              </button>
            )}
          </form>
        </div>

        {/* Tasks List Section */}
        <div className="tasks-section">
          <div className="section-header">
            <h2 className="section-title">Your Tasks</h2>
            <div className="task-stats">
              <span className="stat">
                {tasks.filter((t) => !t.completed).length} Pending
              </span>
              <span className="stat">
                {tasks.filter((t) => t.completed).length} Completed
              </span>
            </div>
          </div>

          {loadingTasks ? (
            <div className="empty-state">
              <div className="empty-icon">
                <CalendarIcon />
              </div>
              <h3>Loading tasks...</h3>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <CalendarIcon />
              </div>
              <h3>No tasks yet</h3>
              <p>
                Create your first task to get started on your productivity
                journey!
              </p>
              <button
                className="empty-cta"
                onClick={() => document.querySelector(".form-input").focus()}
              >
                <PlusIcon />
                Add Your First Task
              </button>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
