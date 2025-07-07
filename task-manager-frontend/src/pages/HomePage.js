// src/pages/HomePage.js
import React from "react";
import { Link } from "react-router-dom";

import "../Home.css";

const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
    <polyline points="17,6 23,6 23,12" />
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>

        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Organize Your Life with
              <span className="title-gradient"> TaskScheduler</span>
            </h1>
            <p className="hero-subtitle">
              The ultimate productivity tool to manage your tasks, set priorities, and achieve your goals.
              Join thousands of users who have transformed their workflow.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="cta-button primary">
                Get Started Free <span className="button-arrow">→</span>
              </Link>
              <Link to="/login" className="cta-button secondary">Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose TaskScheduler?</h2>
            <p className="section-subtitle">
              Powerful features designed to boost your productivity and keep you organized
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <CheckCircleIcon />
              </div>
              <h3 className="feature-title">Smart Task Management</h3>
              <p className="feature-description">
                Create, organize, and prioritize tasks with our intuitive interface.
                Set deadlines, add notes, and track progress effortlessly.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ClockIcon />
              </div>
              <h3 className="feature-title">Time Tracking</h3>
              <p className="feature-description">
                Monitor how much time you spend on each task.
                Get insights into your productivity patterns and optimize your workflow.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUpIcon />
              </div>
              <h3 className="feature-title">Progress Analytics</h3>
              <p className="feature-description">
                Visualize your productivity with detailed charts and reports.
                Track your achievements and identify areas for improvement.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <UsersIcon />
              </div>
              <h3 className="feature-title">Team Collaboration</h3>
              <p className="feature-description">
                Share tasks with team members, assign responsibilities,
                and collaborate seamlessly on projects of any size.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Boost Your Productivity?</h2>
            <p className="cta-subtitle">
              Join thousands of users who have already transformed their workflow with TaskScheduler
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-button primary large">
                Start Free Trial <span className="button-arrow">→</span>
              </Link>
              <Link to="/login" className="cta-button secondary large">
                Sign In Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

