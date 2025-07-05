// src/components/Navbar.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

import "./Navbar.css";

const CalendarIcon = () => (
  <svg
    width="28"
    height="28"
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

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <CalendarIcon />
          <span className="logo-text">TaskScheduler</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/" className="nav-link">
                Home
              </Link>

              <Link to="/tasks" className="nav-link">
                My Tasks
              </Link>

              <button className="nav-link signup-btn" onClick={handleLogout}>
                Logout ({user.username})
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">
                Home
              </Link>

              <Link to="/login" className="nav-link">
                Login
              </Link>

              <Link to="/register" className="nav-link signup-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
