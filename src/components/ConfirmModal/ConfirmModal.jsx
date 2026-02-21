import React from "react";

const ConfirmModal = ({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  type = "danger", // danger | primary
}) => {
  if (!open) return null;

  const confirmBtnClass =
    type === "danger"
      ? "flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium cursor-pointer transition-all hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
      : "flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium cursor-pointer transition-all hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    // confirm-overlay
    <div
      className="fixed inset-0 bg-black/45 flex justify-center items-center z-[3000] animate-[fadeIn_0.2s_ease-in-out]"
      onClick={onCancel}
    >
      {/* confirm-modal */}
      <div
        className="bg-white px-6 py-6 rounded-[14px] w-[340px] max-w-[90%] text-center animate-[scaleIn_0.2s_ease-in-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2.5 font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-500">{message}</p>

        {/* confirm-actions */}
        <div className="mt-5 flex justify-between gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-white text-gray-900 border border-gray-200 rounded-lg font-medium cursor-pointer transition-all hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={confirmBtnClass}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
