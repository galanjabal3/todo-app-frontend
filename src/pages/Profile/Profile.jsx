import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import { formatDisplayDate } from "../../utils/dateUtils";
import { PasswordInput } from "../../components/common/PasswordInput";

const inputClass =
  "w-full px-3 py-[0.6rem] border border-gray-200 rounded-lg text-[0.9rem] transition-all duration-200 bg-white focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-100 disabled:cursor-default";

const btnPrimary =
  "px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2";

const btnSecondary =
  "px-5 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium cursor-pointer transition-all hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed";

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

const Field = ({ label, children }) => (
  <div className="mb-5">
    <label className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    {children}
  </div>
);

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    username: user?.username || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await userAPI.updateProfile(formData);
      updateUser(data);
      setIsEditing(false);
      showNotification({
        open: true,
        type: "success",
        message: "Profile updated successfully",
      });
    } catch (error) {
      showNotification({
        open: true,
        type: "error",
        message: error?.message || "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      showNotification({
        open: true,
        type: "error",
        message: "New passwords do not match.",
      });
      return;
    }
    if (passwordData.new_password.length < 8) {
      showNotification({
        open: true,
        type: "error",
        message: "Password must be at least 8 characters.",
      });
      return;
    }
    setLoading(true);
    try {
      await userAPI.updatePassword({
        current_password: passwordData.current_password,
        password: passwordData.new_password,
      });
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setShowPasswordForm(false);
      showNotification({
        open: true,
        type: "success",
        message: "Password updated successfully",
      });
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/signin";
      }, 2000);
    } catch (error) {
      showNotification({
        open: true,
        type: "error",
        message: error?.message || "Failed to update password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || "",
      username: user?.username || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">My Profile</h1>
          <p className="text-slate-500">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          {/* Colored top bar + avatar */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 h-24 relative">
            <div className="absolute -bottom-10 left-8">
              <div
                className={`w-20 h-20 rounded-2xl ${getAvatarColor(user?.full_name)} text-white flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-white`}
              >
                {getInitials(user?.full_name)}
              </div>
            </div>
          </div>

          <div className="pt-14 px-8 pb-8">
            {/* Name & member since */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {user?.full_name}
              </h2>
              <p className="text-sm text-slate-400 flex items-center gap-1 mt-0.5">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Member since {formatDisplayDate(user?.created_at)}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <Field label="Full Name">
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  className={inputClass}
                />
              </Field>

              <Field label="Username">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  placeholder="Optional"
                  className={inputClass}
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled={true}
                  className={inputClass}
                />
              </Field>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={`${btnPrimary} mt-2`}
                >
                  ✏️ Edit Profile
                </button>
              ) : (
                <div className="flex gap-3 justify-end mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className={btnSecondary}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={btnPrimary}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "✓ Save Changes"
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Security</h2>
          </div>

          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className={btnSecondary}
            >
              🔑 Change Password
            </button>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              {/* // Ganti semua input password di form Change Password */}
              <Field label="Current Password">
                <PasswordInput
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  className={inputClass}
                />
              </Field>
              <Field label="New Password">
                <PasswordInput
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  placeholder="Min 8 characters"
                  className={inputClass}
                />
              </Field>
              <Field label="Confirm New Password">
                <PasswordInput
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  className={inputClass}
                />
              </Field>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      current_password: "",
                      new_password: "",
                      confirm_password: "",
                    });
                  }}
                  className={btnSecondary}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className={btnPrimary}>
                  {loading ? "Updating..." : "✓ Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
