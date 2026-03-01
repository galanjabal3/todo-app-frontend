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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

        <p className="text-sm text-gray-500 mt-2">{description}</p>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
