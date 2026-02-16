import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Layout.css";

const Layout = () => {
  const { user, signout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  const handleSignOut = () => {
    signout();
    setMobileMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return "?";

    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/dashboard" className="navbar-brand">
            📝 Todo App
          </Link>

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

          <div className={`navbar-menu ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <Link
              to="/dashboard"
              className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              📊 Dashboard
            </Link>
            <Link
              to="/tasks/new"
              className={`nav-link ${isActive("/tasks/new") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              ➕ Add Task
            </Link>
            <Link
              to="/groups/join"
              className={`nav-link ${isActive("/groups/join") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              👥 Join Group
            </Link>

            <div className="navbar-divider"></div>

            <div className="navbar-user">
              <Link
                to="/profile"
                className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="user-avatar">
                  {getInitials(user?.full_name)}
                </div>
                {/* <span className="user-name">{user?.full_name}</span> */}
              </Link>
              <button className="btn-signout" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
