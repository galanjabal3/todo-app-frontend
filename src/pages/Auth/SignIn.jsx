import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import "./Auth.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    identity: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const { showNotification } = useNotification();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signin(formData.identity, formData.password);

      showNotification({
        open: true,
        type: "success",
        message: "Signed in successfully",
      });

      navigate("/dashboard");
    } catch (err) {
      showNotification({
        open: true,
        type: "error",
        message: err?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">📝</div>
        <h1>Sign In</h1>
        <p className="auth-subtitle">
          Welcome back! Please sign in to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identity">Email or Username</label>
            <input
              type="text"
              id="identity"
              name="identity"
              value={formData.identity}
              onChange={handleChange}
              required
              placeholder="Enter your email or username"
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <label htmlFor="password">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={loading}
              style={{ paddingRight: "40px" }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "38px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
