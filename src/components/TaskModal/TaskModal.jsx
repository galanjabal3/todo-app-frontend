import React, { useState } from "react";
import { toUTCISOString, toInputDateTime } from "../../utils/dateUtils";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { useNotification } from "../../context/NotificationContext";

const inputClass =
  "w-full px-3 py-[0.6rem] border border-gray-200 rounded-lg text-[0.9rem] transition-all duration-200 bg-white focus:outline-none focus:border-[#6c5ce7] focus:shadow-[0_0_0_2px_rgba(108,92,231,0.15)] disabled:bg-[#f9f9fb] disabled:text-gray-600 disabled:border-gray-100 disabled:cursor-default";

const TaskModal = ({
  task,
  editing,
  setEditing,
  setTask,
  onClose,
  onSave,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!task) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      const formattedTask = {
        ...task,
        due_date: task.due_date ? toUTCISOString(task.due_date) : null,
      };
      await onSave(formattedTask);
      showNotification({
        open: true,
        type: "success",
        message: "Task updated successfully",
      });
      setEditing(false);
    } catch (error) {
      console.error(error);
      showNotification({
        open: true,
        type: "error",
        message: "Failed to update task",
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await onDelete(task.id);
      setShowConfirm(false);
      showNotification({
        open: true,
        type: "success",
        message: "Task deleted successfully",
      });
      onClose();
    } catch (error) {
      console.error(error);
      showNotification({
        open: true,
        type: "error",
        message: "Failed to delete task",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* modal-overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex justify-center items-center z-[1000]"
        onClick={onClose}
      >
        {/* task-modal */}
        <div
          className="w-[750px] max-w-[95%] bg-white p-8 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] animate-[fadeIn_0.2s_ease]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* modal-header */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
            <h2 className="m-0 text-[1.4rem] font-semibold">
              {editing ? "✏ Edit Task" : "📋 Task Details"}
            </h2>
            <button
              onClick={onClose}
              className="bg-transparent border-none text-[1.3rem] cursor-pointer rounded-md px-2 py-1 transition-all hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          {/* modal-body */}
          <div className="mb-6">
            {/* Title */}
            <div className="mb-5">
              <label className="block mb-1.5 font-medium text-sm">
                Task Title *
              </label>
              <input
                type="text"
                value={task.title || ""}
                disabled={!editing}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block mb-1.5 font-medium text-sm">
                Description
              </label>
              <textarea
                rows="4"
                value={task.description || ""}
                disabled={!editing}
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
                className={`${inputClass} resize-y`}
              />
            </div>

            {/* form-row: Due Date + Status */}
            <div className="flex gap-4 md:flex-col">
              <div className="flex-1">
                <label className="block mb-1.5 font-medium text-sm">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={toInputDateTime(task.due_date)}
                  disabled={!editing}
                  onChange={(e) =>
                    setTask({
                      ...task,
                      due_date: e.target.value === "" ? null : e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1.5 font-medium text-sm">
                  Status
                </label>
                <select
                  value={task.status || "todo"}
                  disabled={!editing}
                  onChange={(e) => setTask({ ...task, status: e.target.value })}
                  className={inputClass}
                >
                  <option value="todo">To Do</option>
                  <option value="in progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          </div>

          {/* modal-footer */}
          <div className="flex justify-end gap-3">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  disabled={loading}
                  className="px-5 py-[0.625rem] bg-white text-gray-900 border border-gray-200 rounded-lg font-medium cursor-pointer transition-all hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-5 py-[0.625rem] bg-indigo-600 text-white rounded-lg font-medium cursor-pointer transition-all hover:bg-indigo-700 disabled:opacity-60"
                >
                  {loading ? "Saving..." : "✓ Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={loading}
                  className="px-5 py-[0.625rem] bg-red-500 text-white rounded-lg font-medium cursor-pointer transition-all hover:bg-red-600 disabled:opacity-60"
                >
                  🗑 Delete
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-[0.625rem] bg-white text-gray-900 border border-gray-200 rounded-lg font-medium cursor-pointer transition-all hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="px-5 py-[0.625rem] bg-indigo-600 text-white rounded-lg font-medium cursor-pointer transition-all hover:bg-indigo-700"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        title="Delete Task?"
        message="This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
        loading={loading}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default TaskModal;
