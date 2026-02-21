import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    password_confirm: "",
    full_name: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.message || "Sign up failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Reusable input class
  const inputClass =
    "w-full px-3 py-3 border border-gray-200 rounded-lg text-base transition-colors duration-200 focus:outline-none focus:border-indigo-600 disabled:opacity-60";

  return (
    // auth-container
    <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      {/* auth-card */}
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-[450px]">
        {/* auth-logo */}
        <div className="text-6xl text-center mb-4">📝</div>

        <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center">
          Sign Up
        </h1>
        <p className="text-center text-gray-500 mb-8 text-[0.95rem]">
          Create your account to get started.
        </p>

        {/* message success / error */}
        {message.text && (
          <div
            className={`px-4 py-3 rounded-lg mb-5 text-sm ${
              message.type === "success"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-red-100 text-red-500"
            }`}
          >
            {message.text}
          </div>
        )}

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
              required
              placeholder="Enter your full name"
              disabled={loading}
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
              required
              placeholder="Enter your email"
              disabled={loading}
              className={inputClass}
            />
          </div>

          {/* Username */}
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block mb-2 font-medium text-gray-900 text-sm"
            >
              Username (optional)
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              disabled={loading}
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 font-medium text-gray-900 text-sm"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password (min 8 characters)"
              disabled={loading}
              className={inputClass}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-5">
            <label
              htmlFor="password_confirm"
              className="block mb-2 font-medium text-gray-900 text-sm"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="password_confirm"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              disabled={loading}
              className={inputClass}
            />
          </div>

          {/* btn btn-primary btn-block */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-[0.625rem] px-5 bg-indigo-600 text-white rounded-lg text-base font-medium cursor-pointer transition-all duration-200 inline-flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* auth-footer */}
        <p className="text-center mt-6 text-gray-500 text-sm">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-indigo-600 no-underline font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
