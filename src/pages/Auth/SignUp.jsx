import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    password_confirm: "",
    full_name: "",
  });
  const [message, setMessage] = useState({
    type: "", // 'success' | 'error'
    text: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (formData.password !== formData.password_confirm) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters",
      });
      setLoading(false);
      return;
    }

    try {
      await signup(formData);

      setMessage({
        type: "success",
        text: "Account created successfully! Redirecting...",
      });

      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message || "Sign up failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">📝</div>
        <h1>Sign Up</h1>
        <p className="auth-subtitle">Create your account to get started.</p>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              disabled={loading}
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
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username (optional)</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password (min 8 characters)"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password_confirm">Confirm Password</label>
            <input
              type="password"
              id="password_confirm"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
