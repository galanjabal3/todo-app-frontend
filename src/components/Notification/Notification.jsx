import React, { useEffect } from "react";
import "./Notification.css";

const Notification = ({
  open,
  type = "success", // success | error | warning | info
  message,
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className={`notif-overlay`}>
      <div className={`notif-modal notif-${type}`}>
        <span>{message}</span>
        <button className="notif-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default Notification;
