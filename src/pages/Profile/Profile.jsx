import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import { formatDisplayDate } from "../../utils/dateUtils";

const inputClass =
  "w-full px-3 py-3 border border-gray-200 rounded-lg text-base transition-colors duration-200 focus:outline-none focus:border-indigo-600 disabled:opacity-60 disabled:bg-gray-50";
const btnPrimary =
  "px-5 py-[0.625rem] bg-indigo-600 text-white rounded-lg font-medium cursor-pointer transition-all duration-200 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2";
const btnSecondary =
  "px-5 py-[0.625rem] bg-white text-gray-900 border border-gray-200 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed";

const Profile = () => {
  const { user, updateUser, signout } = useAuth();
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

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  };

  return (
    <div className="p-8 max-w-[800px] mx-auto md:p-4">
      {/* profile-header */}
      <div className="flex justify-between items-center mb-8 md:flex-col md:items-start md:gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          👤 My Profile
        </h1>
        <button
          onClick={signout}
          className="px-5 py-[0.625rem] bg-red-500 text-white rounded-lg font-medium cursor-pointer transition-all hover:bg-red-600 md:w-full"
        >
          Sign Out
        </button>
      </div>

      {/* profile-card — Info */}
      <div className="bg-white p-8 rounded-2xl shadow-md mb-8 md:p-6">
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center text-[2.5rem] font-semibold shadow-[0_4px_6px_rgba(79,70,229,0.3)] md:w-20 md:h-20 md:text-[2rem]">
            {getInitials(user?.full_name)}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-5">
            <label
              htmlFor="full_name"
              className="block mb-2 font-medium text-gray-900 text-sm"
            >
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              disabled={!isEditing || loading}
              className={inputClass}
            />
          </div>

          {/* Username */}
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block mb-2 font-medium text-gray-900 text-sm"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing || loading}
              placeholder="Optional"
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 font-medium text-gray-900 text-sm"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={true}
              className={inputClass}
            />
          </div>

          {/* profile-info */}
          <div className="bg-gray-50 px-4 py-3 rounded-lg mb-6">
            <p className="my-2 text-gray-500 text-sm">
              <strong className="text-gray-900">📅 Member since:</strong>{" "}
              {formatDisplayDate(user?.created_at)}
            </p>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={`${btnPrimary} w-full`}
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="flex gap-4 justify-end mt-6">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className={btnSecondary}
              >
                Cancel
              </button>
              <button type="submit" disabled={loading} className={btnPrimary}>
                {loading ? "Saving..." : "✓ Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* profile-card — Security */}
      <div className="bg-white p-8 rounded-2xl shadow-md md:p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          🔒 Security
        </h2>

        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className={btnSecondary}
          >
            🔑 Change Password
          </button>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            {/* Current Password */}
            <div className="mb-5">
              <label
                htmlFor="current_password"
                className="block mb-2 font-medium text-gray-900 text-sm"
              >
                Current Password
              </label>
              <input
                type="password"
                id="current_password"
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                required
                disabled={loading}
                className={inputClass}
              />
            </div>

            {/* New Password */}
            <div className="mb-5">
              <label
                htmlFor="new_password"
                className="block mb-2 font-medium text-gray-900 text-sm"
              >
                New Password
              </label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                required
                disabled={loading}
                placeholder="Min 8 characters"
                className={inputClass}
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-5">
              <label
                htmlFor="confirm_password"
                className="block mb-2 font-medium text-gray-900 text-sm"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                required
                disabled={loading}
                className={inputClass}
              />
            </div>

            <div className="flex gap-4 justify-end mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    current_password: "",
                    new_password: "",
                    confirm_password: "",
                  });
                }}
                disabled={loading}
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
  );
};

export default Profile;
