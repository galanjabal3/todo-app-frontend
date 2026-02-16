import React, { createContext, useContext, useState, useCallback } from "react";
import Notification from "../components/Notification/Notification";

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notif, setNotif] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const showNotification = useCallback(({ type, message, duration = 3000 }) => {
    setNotif({
      open: true,
      type,
      message,
      duration,
    });
  }, []);

  const closeNotification = () => {
    setNotif((prev) => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      <Notification
        open={notif.open}
        type={notif.type}
        message={notif.message}
        duration={notif.duration}
        onClose={closeNotification}
      />
    </NotificationContext.Provider>
  );
};
