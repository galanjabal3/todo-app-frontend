import { AlertTriangle, ShieldX, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ErrorStatePage({
  type = "server", // "server" | "expired" | "forbidden" | "network"
  title,
  description,
}) {
  const navigate = useNavigate();

  const config = {
    server: {
      icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
      title: "Something went wrong",
      description: "We couldn’t process your request. Please try again later.",
      action: () => window.location.reload(),
      buttonText: "Retry",
    },
    expired: {
      icon: <ShieldX className="w-12 h-12 text-yellow-500" />,
      title: "Session expired",
      description: "Your session has expired. Please log in again to continue.",
      action: () => navigate("/signin"),
      buttonText: "Go to Login",
    },
    forbidden: {
      icon: <ShieldX className="w-12 h-12 text-red-500" />,
      title: "Access denied",
      description: "You don’t have permission to access this page.",
      action: () => navigate("/dashboard"),
      buttonText: "Back to Dashboard",
    },
    network: {
      icon: <WifiOff className="w-12 h-12 text-gray-500" />,
      title: "Network error",
      description: "Please check your internet connection and try again.",
      action: () => window.location.reload(),
      buttonText: "Retry",
    },
  };

  const current = config[type];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">{current.icon}</div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {title || current.title}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            {description || current.description}
          </p>
        </div>

        <button
          onClick={current.action}
          className="w-full py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 transition cursor-pointer"
        >
          {current.buttonText}
        </button>
      </div>
    </div>
  );
}
