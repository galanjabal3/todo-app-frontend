import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../services/api";
import { useNotification } from "../../context/NotificationContext";
import { formatDisplayDate } from "../../utils/dateUtils";
import "./Profile.css";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

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
        message: error?.data?.message || "Failed to update profile.",
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

    if (passwordData.new_password.length < 6) {
      showNotification({
        open: true,
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    setLoading(true);

    try {
      await userAPI.updateProfile({
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
        text: "Password updated successfully! ✓",
      });
    } catch (error) {
      showNotification({
        open: true,
        type: "error",
        text: error.response?.data?.message || "Failed to update password.",
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
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>👤 My Profile</h1>
        <button className="btn btn-danger" onClick={signout}>
          Sign Out
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">{getInitials(user?.full_name)}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              disabled={!isEditing || loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing || loading}
              placeholder="Optional"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={true}
            />
          </div>

          <div className="profile-info">
            <p>
              <strong>📅 Member since:</strong> {formatDisplayDate(user?.created_at)}
            </p>
          </div>

          {!isEditing ? (
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "✓ Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="profile-card">
        <h2>🔒 Security</h2>

        {!showPasswordForm ? (
          <button
            className="btn btn-secondary"
            onClick={() => setShowPasswordForm(true)}
          >
            🔑 Change Password
          </button>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="current_password">Current Password</label>
              <input
                type="password"
                id="current_password"
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="new_password">New Password</label>
              <input
                type="password"
                id="new_password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                required
                disabled={loading}
                placeholder="Min 6 characters"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password">Confirm New Password</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    current_password: "",
                    new_password: "",
                    confirm_password: "",
                  });
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
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
