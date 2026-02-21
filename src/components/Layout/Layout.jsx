import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-[100] backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-8 h-[4.2rem] flex items-center justify-between">
          {/* Brand */}
          <Link
            to="/dashboard"
            className="text-[1.4rem] font-bold text-indigo-600 no-underline flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            📝 Todo App
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden bg-transparent border-none text-[1.6rem] cursor-pointer text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/dashboard"
              className={`no-underline px-[0.9rem] py-2 rounded-[0.6rem] font-medium flex items-center gap-2 transition-all duration-200
                ${
                  isActive("/dashboard")
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              📊 Dashboard
            </Link>
            <Link
              to="/tasks/new"
              className={`no-underline px-[0.9rem] py-2 rounded-[0.6rem] font-medium flex items-center gap-2 transition-all duration-200
                ${
                  isActive("/tasks/new")
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              ➕ Add Task
            </Link>
            <Link
              to="/groups/join"
              className={`no-underline px-[0.9rem] py-2 rounded-[0.6rem] font-medium flex items-center gap-2 transition-all duration-200
                ${
                  isActive("/groups/join")
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              👥 Join Group
            </Link>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200 mx-[0.8rem]" />

            {/* User Section */}
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className={`no-underline px-[0.9rem] py-2 rounded-[0.6rem] font-medium flex items-center gap-2 transition-all duration-200
                  ${
                    isActive("/profile")
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-[2.2rem] h-[2.2rem] rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-semibold text-[0.9rem] transition-transform hover:scale-105">
                  {getInitials(user?.full_name)}
                </div>
              </Link>
              <button
                onClick={handleSignOut}
                className="px-[0.9rem] py-[0.45rem] border border-gray-200 rounded-[0.6rem] bg-white cursor-pointer text-gray-500 font-medium transition-all duration-200 hover:bg-red-50 hover:text-red-500 hover:border-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-[4.2rem] left-0 right-0 bg-white flex flex-col p-4 gap-2 border-b border-gray-200 shadow-lg animate-[slideDown_0.2s_ease_forwards]">
            <Link
              to="/dashboard"
              className={`no-underline px-4 py-3 rounded-[0.6rem] font-medium flex items-center gap-2 transition-all duration-200
                ${
                  isActive("/dashboard")
                    ? "bg-indigo-600 text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              📊 Dashboard
            </Link>
            <Link
              to="/tasks/new"
              className={`no-underline px-4 py-3 rounded-[0.6rem] font-medium flex items-center gap-2 transition-all duration-200
                ${
                  isActive("/tasks/new")
                    ? "bg-indigo-600 text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              ➕ Add Task
            </Link>
            <Link
              to="/groups/join"
              className={`no-underline px-4 py-3 rounded-[0.6rem] font-medium flex items-center gap-2 transition-all duration-200
                ${
                  isActive("/groups/join")
                    ? "bg-indigo-600 text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              👥 Join Group
            </Link>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200 my-2" />

            {/* User Section Mobile */}
            <div className="flex flex-col gap-2">
              <Link
                to="/profile"
                className={`no-underline px-4 py-3 rounded-[0.6rem] font-medium flex items-center gap-2 transition-all duration-200
                  ${
                    isActive("/profile")
                      ? "bg-indigo-600 text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-[2.2rem] h-[2.2rem] rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-semibold text-[0.9rem]">
                  {getInitials(user?.full_name)}
                </div>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-3 border border-gray-200 rounded-[0.6rem] bg-white cursor-pointer text-gray-500 font-medium transition-all duration-200 hover:bg-red-50 hover:text-red-500 hover:border-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 max-w-[1400px] w-full mx-auto md:p-8 p-5">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
