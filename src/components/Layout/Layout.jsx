import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppLogo from "../common/AppLogo";

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const getAvatarColor = (name = "") => {
  const colors = [
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-cyan-500",
    "bg-rose-500",
    "bg-amber-500",
  ];
  const index = [...(name || "")].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const Layout = () => {
  const { user, signout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  const handleSignOut = () => {
    signout();
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-[4.2rem] flex items-center justify-between">
          {/* Brand */}
          <Link
            to="/dashboard"
            className="no-underline hover:opacity-80 transition-opacity"
          >
            <AppLogo size="sm" showText={true} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-500 hover:text-slate-700 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/dashboard"
              className={`no-underline px-3.5 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-all
                ${
                  isActive("/dashboard")
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              Dashboard
            </Link>

            <div className="w-px h-6 bg-slate-200 mx-2" />

            {/* Avatar — link ke profile */}
            <Link
              to="/profile"
              className={`no-underline rounded-lg p-1 transition-all
                ${isActive("/profile") ? "ring-2 ring-indigo-400 ring-offset-1" : "hover:ring-2 hover:ring-slate-200 hover:ring-offset-1"}`}
            >
              <div
                className={`w-9 h-9 rounded-lg ${getAvatarColor(user?.full_name)} text-white flex items-center justify-center font-semibold text-sm`}
              >
                {getInitials(user?.full_name)}
              </div>
            </Link>

            <button
              onClick={handleSignOut}
              className="px-3.5 py-2 border border-slate-200 rounded-lg bg-white text-slate-500 text-sm font-medium transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-300"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-5 py-4 flex flex-col gap-2 shadow-lg">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`no-underline px-4 py-3 rounded-lg font-medium flex items-center gap-2 text-sm transition-all
                ${isActive("/dashboard") ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              Dashboard
            </Link>

            <div className="w-full h-px bg-slate-100 my-1" />

            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={`no-underline px-4 py-3 rounded-lg font-medium flex items-center gap-3 text-sm transition-all
                ${isActive("/profile") ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <div
                className={`w-8 h-8 rounded-lg ${getAvatarColor(user?.full_name)} text-white flex items-center justify-center font-semibold text-xs`}
              >
                {getInitials(user?.full_name)}
              </div>
              {user?.full_name}
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-500 text-sm font-medium transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-300"
            >
              Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
