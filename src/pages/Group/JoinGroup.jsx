import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { groupAPI } from "../../services/api";

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
      let groupCode = code.trim();
      if (groupCode.includes("/")) {
        const parts = groupCode.split("/");
        groupCode = parts[parts.length - 1];
      }
      const response = await groupAPI.joinGroup(groupCode);
      setSuccess(`Successfully joined ${response.data.name}! 🎉`);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err?.message || "Invalid code or link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-[600px] mx-auto md:p-4">
      {/* join-group-card */}
      <div className="bg-white p-8 rounded-2xl shadow-md md:p-6">
        {/* form-header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">👥 Join a Group</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-transparent border-none text-xl cursor-pointer text-gray-500 hover:text-gray-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* subtitle */}
        <p className="text-gray-500 mb-8 leading-relaxed">
          Enter a group code or paste an invite link to join a group and
          collaborate with others.
        </p>

        {/* error-message */}
        {error && (
          <div className="bg-red-100 text-red-500 px-4 py-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        {/* message success */}
        {success && (
          <div className="bg-emerald-100 text-emerald-600 px-4 py-3 rounded-lg mb-5 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* form-group */}
          <div className="mb-5">
            <label
              htmlFor="code"
              className="block mb-2 font-medium text-gray-900 text-sm"
            >
              Group Code or Link
            </label>
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
              className="w-full px-3 py-3 border border-gray-200 rounded-lg text-base transition-colors duration-200 focus:outline-none focus:border-indigo-600 disabled:opacity-60"
            />
          </div>

          {/* form-actions */}
          <div className="flex gap-4 justify-end mt-6 md:flex-col-reverse">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
              className="px-5 py-[0.625rem] bg-white text-gray-900 border border-gray-200 rounded-lg font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="px-5 py-[0.625rem] bg-indigo-600 text-white rounded-lg font-medium cursor-pointer transition-all duration-200 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Joining..." : "✓ Join Group"}
            </button>
          </div>
        </form>

        {/* join-group-info */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            💡 How to join a group:
          </h3>
          <ul className="list-none p-0">
            {[
              "Ask a group admin for an invite code or link",
              "Enter the code or paste the link above",
              "You'll be added to the group immediately",
              "Start collaborating on tasks with your team!",
            ].map((item, i) => (
              <li key={i} className="py-3 text-gray-500 flex items-start gap-3">
                <span className="text-emerald-500 font-bold flex-shrink-0 text-xl">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* join-group-example */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h4 className="text-base font-semibold mb-4 flex items-center gap-2">
            📋 Example:
          </h4>
          <div className="bg-white border border-gray-200 px-4 py-3 rounded-md font-mono text-sm text-indigo-600 my-2 text-center">
            ABC123
          </div>
          <p className="text-center text-gray-500 text-sm my-2">or</p>
          <div className="bg-white border border-gray-200 px-4 py-3 rounded-md font-mono text-sm text-indigo-600 my-2 text-center">
            https://app.com/join/ABC123
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGroup;
