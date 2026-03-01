import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { groupAPI } from "../../services/api";
import AppLogo from "../../components/common/AppLogo";

const getAvatarColor = (name = "") => {
  const colors = [
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-cyan-500",
    "bg-rose-500",
    "bg-amber-500",
  ];
  const index = [...(name || "")].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const JoinGroup = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("preview"); // preview | loading | success | error | already
  const [message, setMessage] = useState("");
  const [groupInfo, setGroupInfo] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState("");

  // Load group preview on mount
  useEffect(() => {
    const loadPreview = async () => {
      try {
        const res = await groupAPI.previewGroup(token);
        console.log(res);

        setGroupInfo(res);
      } catch (error) {
        const msg = error?.message || "";
        if (msg.toLowerCase().includes("expired")) {
          setPreviewError("This invite link has expired.");
        } else if (msg.toLowerCase().includes("invalid")) {
          setPreviewError("This invite link is invalid.");
        } else {
          setPreviewError(msg || "Something went wrong.");
        }
        setStatus("error");
        setMessage(previewError);
      } finally {
        setPreviewLoading(false);
      }
    };
    loadPreview();
  }, []);

  const handleJoin = async () => {
    setStatus("loading");
    try {
      await groupAPI.joinGroup(token);
      setStatus("success");
    } catch (error) {
      const msg = error?.message || "";
      if (msg.toLowerCase().includes("already")) {
        setStatus("already");
        setMessage(msg);
      } else if (msg.toLowerCase().includes("expired")) {
        setStatus("error");
        setMessage("This invite link has expired.");
      } else {
        setStatus("error");
        setMessage(msg || "Something went wrong.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-6 text-center">
          <div className="flex justify-center mb-4">
            <AppLogo size="md" showText={false} />
          </div>
          <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest mb-1">
            Group Invite
          </p>
          <h1 className="text-white text-xl font-bold">You're Invited!</h1>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col items-center text-center">
          {/* ── Preview loading ── */}
          {previewLoading && (
            <>
              <svg
                className="animate-spin w-10 h-10 text-indigo-400 mb-4"
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
              <p className="text-slate-500 text-sm">Loading invite...</p>
            </>
          )}

          {/* ── Preview — konfirmasi join ── */}
          {!previewLoading && status === "preview" && groupInfo && (
            <>
              {/* Group Avatar */}
              <div
                className={`w-20 h-20 rounded-2xl ${getAvatarColor(groupInfo.name)} text-white flex items-center justify-center text-2xl font-bold shadow-lg mb-4`}
              >
                {getInitials(groupInfo.name)}
              </div>

              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
                You've been invited to join
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                {groupInfo.name}
              </h2>
              <p className="text-sm text-slate-400 mb-8">
                {groupInfo.member_count}{" "}
                {groupInfo.member_count === 1 ? "member" : "members"}
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoin}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition text-sm cursor-pointer"
                >
                  Join Group
                </button>
              </div>
            </>
          )}

          {/* ── Joining loading ── */}
          {status === "loading" && (
            <>
              <svg
                className="animate-spin w-12 h-12 text-indigo-500 mb-4"
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
              <p className="text-slate-600 font-medium">Joining group...</p>
              <p className="text-sm text-slate-400 mt-1">
                Please wait a moment
              </p>
            </>
          )}

          {/* ── Success ── */}
          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-slate-800 font-semibold text-lg mb-1">
                Request Sent!
              </p>
              <p className="text-sm text-slate-400 mb-2">
                Your request to join{" "}
                <span className="font-semibold text-slate-600">
                  {groupInfo?.name}
                </span>{" "}
                has been sent.
              </p>
              <p className="text-sm text-slate-400 mb-6">
                Please wait for the admin to approve.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition text-sm cursor-pointer"
              >
                Go to Dashboard
              </button>
            </>
          )}

          {/* ── Already joined/requested ── */}
          {status === "already" && (
            <>
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-slate-800 font-semibold text-lg mb-1">
                Already Requested
              </p>
              <p className="text-sm text-slate-400 mb-6">
                {message || "You have already requested to join this group."}
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition text-sm cursor-pointer"
              >
                Go to Dashboard
              </button>
            </>
          )}

          {/* ── Error ── */}
          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-slate-800 font-semibold text-lg mb-1">
                Failed to Join
              </p>
              <p className="text-sm text-slate-400 mb-6">
                {message || previewError}
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition text-sm cursor-pointer"
              >
                Back to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinGroup;
