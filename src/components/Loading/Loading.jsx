import React from "react";

const sizeMap = {
  sm: { spinner: "w-8 h-8 border-[3px]", text: "text-sm" },
  md: { spinner: "w-12 h-12 border-4", text: "text-base" },
  lg: { spinner: "w-16 h-16 border-[5px]", text: "text-lg" },
};

const Loading = ({ fullscreen = true, text = "Loading...", size = "md" }) => {
  const { spinner, text: textSize } = sizeMap[size] || sizeMap.md;

  const wrapper = fullscreen
    ? "fixed inset-0 bg-overlay backdrop-blur-sm flex flex-col justify-center items-center z-[9999]"
    : "flex flex-col justify-center items-center py-16 w-full";

  return (
    <div className={wrapper}>
      <div
        className={`${spinner} rounded-full border-indigo-100 border-t-indigo-600 animate-spin`}
      />
      {text && (
        <p className={`mt-4 text-soft font-medium ${textSize}`}>{text}</p>
      )}
    </div>
  );
};

export default Loading;
