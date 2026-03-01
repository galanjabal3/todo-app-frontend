import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { PasswordInput } from "../../components/common/PasswordInput";
import AppLogo from "../../components/common/AppLogo";

const inputClass =
  "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:opacity-60 disabled:bg-gray-50";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    password_confirm: "",
    full_name: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showNotification } = useNotification();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.password_confirm) {
      showNotification({
        open: true,
        type: "error",
        message: "Passwords do not match",
      });
      setLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      showNotification({
        open: true,
        type: "error",
        message: "Password must be at least 8 characters",
      });
      setLoading(false);
      return;
    }

    try {
      await signup(formData);
      showNotification({
        open: true,
        type: "success",
        message: "Account created successfully!",
      });
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err) {
      showNotification({
        open: true,
        type: "error",
        message: err?.message || "Sign up failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-indigo-600 to-violet-600">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AppLogo size="lg" showText={false} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
          <p className="text-indigo-200 text-sm">
            Sign up to get started for free
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit}>
            {[
              {
                label: "Full Name",
                name: "full_name",
                type: "text",
                placeholder: "Enter your full name",
                required: true,
                minLength: 1,
              },
              {
                label: "Email",
                name: "email",
                type: "email",
                placeholder: "Enter your email",
                required: true,
                minLength: 1,
              },
              {
                label: "Username (optional)",
                name: "username",
                type: "text",
                placeholder: "Choose a username",
                required: false,
                minLength: 6,
              },
            ].map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  placeholder={field.placeholder}
                  disabled={loading}
                  className={inputClass}
                  minLength={field.minLength}
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Password
              </label>
              <PasswordInput
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                placeholder="Min 8 characters"
                className={inputClass}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Confirm Password
              </label>
              <PasswordInput
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                disabled={loading}
                placeholder="Confirm your password"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 text-white text-sm rounded-lg font-semibold transition hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500 text-sm">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
