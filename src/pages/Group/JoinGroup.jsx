import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { groupAPI } from "../../services/api";
import "./JoinGroup.css";

const JoinGroup = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!code.trim()) {
      setError("Please enter a group code or link");
      setLoading(false);
      return;
    }

    try {
      // Extract code from link if URL is provided
      let groupCode = code.trim();
      if (groupCode.includes("/")) {
        const parts = groupCode.split("/");
        groupCode = parts[parts.length - 1];
      }

      const response = await groupAPI.joinGroup(groupCode);
      setSuccess(`Successfully joined ${response.data.name}! 🎉`);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid code or link. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-group-container">
      <div className="join-group-card">
        <div className="form-header">
          <h1>👥 Join a Group</h1>
          <button className="btn-close" onClick={() => navigate("/dashboard")}>
            ✕
          </button>
        </div>

        <p className="join-group-subtitle">
          Enter a group code or paste an invite link to join a group and
          collaborate with others.
        </p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="message success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="code">Group Code or Link</label>
            <input
              type="text"
              id="code"
              name="code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
                setSuccess("");
              }}
              placeholder="Enter code (e.g., ABC123) or paste invite link"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !code.trim()}
            >
              {loading ? "Joining..." : "✓ Join Group"}
            </button>
          </div>
        </form>

        <div className="join-group-info">
          <h3>💡 How to join a group:</h3>
          <ul>
            <li>Ask a group admin for an invite code or link</li>
            <li>Enter the code or paste the link above</li>
            <li>You'll be added to the group immediately</li>
            <li>Start collaborating on tasks with your team!</li>
          </ul>
        </div>

        <div className="join-group-example">
          <h4>📋 Example:</h4>
          <div className="example-code">ABC123</div>
          <p className="example-text">or</p>
          <div className="example-code">https://app.com/join/ABC123</div>
        </div>
      </div>
    </div>
  );
};

export default JoinGroup;
