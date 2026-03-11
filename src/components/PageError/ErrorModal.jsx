import { X } from "lucide-react";

export default function ErrorModal({
  open,
  onClose,
  title = "Error",
  description = "Something went wrong.",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 relative transition-colors duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-app hover:text-soft"
        >
          <X size={18} />
        </button>
        <h3 className="text-lg font-semibold text-app">{title}</h3>
        <p className="text-sm text-soft mt-2">{description}</p>
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
