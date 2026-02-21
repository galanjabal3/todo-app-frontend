import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

const SignIn = () => {
  const [formData, setFormData] = useState({
    identity: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { signin } = useAuth();
  const { showNotification } = useNotification();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    // auth-container
    <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      {/* auth-card */}
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-[450px]">
        {/* auth-logo */}
        <div className="text-6xl text-center mb-4">📝</div>

        <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center">
          Sign In
        </h1>
        <p className="text-center text-gray-500 mb-8 text-[0.95rem]">
          Welcome back! Please sign in to continue.
        </p>

        <form onSubmit={handleSubmit}>
          {/* form-group: identity */}
          <div className="mb-5">
            <label
              htmlFor="identity"
              className="block mb-2 font-medium text-gray-900 text-sm"
            >
              Email or Username
            </label>
            <input
              type="text"
              id="identity"
              name="identity"
              value={formData.identity}
              onChange={handleChange}
              required
              placeholder="Enter your email or username"
              disabled={loading}
              className="w-full px-3 py-3 border border-gray-200 rounded-lg text-base transition-colors duration-200 focus:outline-none focus:border-indigo-600 disabled:opacity-60"
            />
          </div>

          {/* form-group: password */}
          <div className="mb-5 relative">
            <label
              htmlFor="password"
              className="block mb-2 font-medium text-gray-900 text-sm"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={loading}
              className="w-full px-3 py-3 pr-10 border border-gray-200 rounded-lg text-base transition-colors duration-200 focus:outline-none focus:border-indigo-600 disabled:opacity-60"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] cursor-pointer select-none"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* btn btn-primary btn-block */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-[0.625rem] px-5 bg-indigo-600 text-white rounded-lg text-base font-medium cursor-pointer transition-all duration-200 inline-flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* auth-footer */}
        <p className="text-center mt-6 text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 no-underline font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
