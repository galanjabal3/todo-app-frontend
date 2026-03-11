import React from "react";
import { btnPrimary, btnSecondary, btnDanger } from "../../utils/styles";

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
    type === "danger" ? `flex-1 ${btnDanger}` : `flex-1 ${btnPrimary}`;

  return (
    <div
      className="fixed inset-0 bg-black/45 dark:bg-black/60 flex justify-center items-center z-[3000] animate-[fadeIn_0.2s_ease-in-out]"
      onClick={onCancel}
    >
      <div
        className="bg-card px-6 py-6 rounded-[14px] w-[340px] max-w-[90%] text-center animate-[scaleIn_0.2s_ease-in-out] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2.5 font-semibold text-lg text-app">{title}</h3>
        <p className="text-sm text-soft">{message}</p>

        <div className="mt-5 flex justify-between gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className={`flex-1 ${btnSecondary}`}
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
