import { useState, useEffect } from "react";
import { groupAPI } from "../../services/api";

const InviteModal = ({ groupId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [inviteData, setInviteData] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await groupAPI.inviteMember(groupId);
      setInviteData({
        link: res.link,
        expires_days: res.expires_days,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteData.link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRegenerate = () => {
    setInviteData(null);
    handleGenerate();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 flex justify-between items-center">
          <div>
            <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest mb-0.5">
              Group Invite
            </p>
            <h2 className="text-white text-lg font-semibold">
              🔗 Invite Member
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg w-8 h-8 flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center py-8 text-slate-400">
              <svg
                className="animate-spin w-8 h-8 text-indigo-500 mb-3"
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
              <p className="text-sm">Generating invite link...</p>
            </div>
          ) : inviteData ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-slate-500">
                Share this link to invite new members. Valid for{" "}
                <span className="font-semibold text-slate-700">
                  {inviteData.expires_days} days
                </span>
                .
              </p>

              {/* Invite Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                  Invite Link
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-600 truncate">
                    {inviteData.link}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition flex-shrink-0 flex items-center gap-1.5 ${
                      copiedLink
                        ? "bg-emerald-500 text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Expiry + Regenerate */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Expires in {inviteData.expires_days} days
                </p>
                <button
                  onClick={handleRegenerate}
                  className="text-xs text-slate-400 hover:text-indigo-600 transition underline"
                >
                  Generate new link
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
