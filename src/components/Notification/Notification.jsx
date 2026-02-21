import React, { useEffect } from "react";

const Notification = ({
  open,
  type = "success", // success | error | warning | info
  message,
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  const typeClass =
    {
      success: "bg-emerald-500",
      error: "bg-red-500",
      warning: "bg-amber-500",
      info: "bg-blue-500",
    }[type] || "bg-emerald-500";

  return (
    // notif-overlay
    <div className="fixed top-5 right-5 z-[4000]">
      {/* notif-modal */}
      <div
        className={`min-w-[280px] px-[18px] py-[14px] rounded-[10px] text-white flex justify-between items-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] animate-[slideIn_0.3s_ease_forwards] ${typeClass}`}
      >
        <span>{message}</span>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-white text-sm cursor-pointer ml-4"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Notification;
