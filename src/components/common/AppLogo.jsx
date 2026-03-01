// components/common/AppLogo.jsx

const AppLogo = ({ size = "md", showText = true }) => {
  const sizes = {
    sm: { icon: "w-7 h-7", text: "text-base", radius: "rounded-lg" },
    md: { icon: "w-9 h-9", text: "text-xl", radius: "rounded-xl" },
    lg: { icon: "w-16 h-16", text: "text-3xl", radius: "rounded-2xl" },
    xl: { icon: "w-20 h-20", text: "text-4xl", radius: "rounded-2xl" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      {/* Icon */}
      <div
        className={`${s.icon} ${s.radius} bg-gradient-to-br from-indigo-500 via-violet-500 to-indigo-700 flex items-center justify-center shadow-md flex-shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-[60%] h-[60%]"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Notebook */}
          <rect
            x="4"
            y="3"
            width="14"
            height="18"
            rx="2"
            fill="white"
            fillOpacity="0.15"
            stroke="white"
            strokeWidth="1.8"
          />
          {/* Lines */}
          <line x1="8" y1="9" x2="15" y2="9" stroke="white" strokeWidth="1.5" />
          <line
            x1="8"
            y1="12"
            x2="15"
            y2="12"
            stroke="white"
            strokeWidth="1.5"
          />
          <line
            x1="8"
            y1="15"
            x2="12"
            y2="15"
            stroke="white"
            strokeWidth="1.5"
          />
          {/* Pencil */}
          <path
            d="M16 17l2-2-2-2-2 2 2 2z"
            fill="white"
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M18 15l1.5-1.5a1 1 0 000-1.4l-.6-.6a1 1 0 00-1.4 0L16 13"
            stroke="white"
            strokeWidth="1.2"
          />
          {/* Spiral rings */}
          <path d="M9 3v2M12 3v2M15 3v2" stroke="white" strokeWidth="1.8" />
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <span
          className={`${s.text} font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent`}
        >
          Todo App
        </span>
      )}
    </div>
  );
};

export default AppLogo;
