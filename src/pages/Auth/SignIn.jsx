import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { PasswordInput } from "../../components/common/PasswordInput";
import AppLogo from "../../components/common/AppLogo";

const inputClass =
  "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:opacity-60 disabled:bg-gray-50";

// const inputClass =
//   "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm ...";

const SignIn = () => {
  const [formData, setFormData] = useState({ identity: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signin } = useAuth();
  const { showNotification } = useNotification();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
      const params = new URLSearchParams(location.search);
      navigate(params.get("redirect") || "/dashboard");
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
    <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-indigo-600 to-violet-600">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AppLogo size="lg" showText={false} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-indigo-200 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Email or Username
              </label>
              <input
                type="text"
                name="identity"
                value={formData.identity}
                onChange={handleChange}
                required
                placeholder="Enter your email or username"
                disabled={loading}
                className={inputClass}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Password
              </label>
              <PasswordInput
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter your password"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 text-white text-sm  rounded-lg font-semibold transition hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
