// src/components/TaskItem.js
import React from "react";
import { format, parseISO } from "date-fns"; // For date formatting

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

const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3,6 5,6 21,6" />
    <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "linear-gradient(135deg, #ef4444, #dc2626)";
    case "Medium":
      return "linear-gradient(135deg, #f59e0b, #d97706)";
    case "Low":
      return "linear-gradient(135deg, #10b981, #059669)";
    default:
      return "linear-gradient(135deg, #6b7280, #4b5563)";
  }
};

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(parseISO(dateString), "PPP");
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    return format(parseISO(dateTimeString), "PPpp");
  };

  return (
    <div
      key={task._id}
      className={`task-card ${task.completed ? "completed" : ""}`}
    >
      {" "}
      <div className="task-card-glow"></div>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>

        <span
          className={`task-status ${task.completed ? "completed" : "pending"}`}
        >
          {task.completed && <CheckIcon />}
          {task.completed ? "Completed" : "Pending"}
        </span>
      </div>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <div className="task-details">
        {task.dueDate && (
          <div className="task-detail">
            <CalendarIcon />
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>
        )}

        <div className="task-detail">
          <div
            className="priority-badge"
            style={{ background: getPriorityColor(task.priority) }}
          >
            Priority: {task.priority}
          </div>
        </div>

        {task.reminder && (
          <div className="task-detail">
            <ClockIcon />
            <span>Reminder: {formatDateTime(task.reminder)}</span>
          </div>
        )}
      </div>
      <div className="task-actions">
        <button
          className="action-btn complete-btn"
          onClick={() => onToggleComplete(task._id)}
        >
          {task.completed ? (
            <>
              <CheckIcon />
              <span>Pending</span>
            </>
          ) : (
            <>
              <CheckIcon />
              <span>Complete</span>
            </>
          )}
        </button>

        <button className="action-btn edit-btn" onClick={() => onEdit(task)}>
          <EditIcon />
          <span>Edit</span>
        </button>

        <button
          className="action-btn delete-btn"
          onClick={() => onDelete(task._id)}
        >
          <TrashIcon />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
