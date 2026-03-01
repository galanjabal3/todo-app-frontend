import React, { useState } from "react";
import { toUTCISOString, toInputDateTime } from "../../utils/dateUtils";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { useNotification } from "../../context/NotificationContext";

const inputClass =
  "w-full px-3 py-[0.6rem] border border-gray-200 rounded-lg text-[0.9rem] transition-all duration-200 bg-white focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-100 disabled:cursor-default";

const getAvatarColor = (name = "") => {
  const colors = [
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-orange-400",
    "bg-pink-500",
    "bg-violet-500",
    "bg-cyan-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-teal-500",
  ];
  const index = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const Avatar = ({ full_name, size = "sm" }) => {
  const sizeClass = size === "sm" ? "w-7 h-7 text-[11px]" : "w-8 h-8 text-xs";
  return (
    <div
      className={`${sizeClass} ${getAvatarColor(full_name)} rounded-full text-white flex items-center justify-center font-bold flex-shrink-0`}
    >
      {getInitials(full_name)}
    </div>
  );
};

const Field = ({ label, required, children }) => (
  <div className="mb-5">
    <label className="block mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const TaskModal = ({
  task,
  editing,
  setEditing,
  setTask,
  onClose,
  onSave,
  onDelete,
  isCreating = false,
  members = [], // ← array member dari group
}) => {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!task) return null;

  const currentAssignedId =
    task.assigned_to_id !== undefined
      ? task.assigned_to_id
      : task.assigned_to?.id;

  const assignedMember = currentAssignedId
    ? members.filter(Boolean).find((m) => m.id === currentAssignedId) || null
    : null;

  const handleSave = async () => {
    setSubmitted(true);

    if (!task.title?.trim()) {
      showNotification({
        open: true,
        type: "error",
        message: "Task title is required",
      });
      return;
    }
    try {
      setLoading(true);
      const formattedTask = {
        ...task,
        due_date: task.due_date ? toUTCISOString(task.due_date) : null,
      };
      await onSave(formattedTask);
      setEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await onDelete(task.id);
      setShowConfirm(false);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000] p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-[680px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Colored header bar ── */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-5 flex justify-between items-center">
            <div>
              <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest mb-0.5">
                {isCreating ? "New Task" : editing ? "Editing" : "Task Details"}
              </p>
              <h2 className="text-white text-xl font-semibold m-0 leading-tight">
                {isCreating
                  ? "✨ Create Task"
                  : editing
                    ? "✏️ Edit Task"
                    : task.title || "Task Details"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg w-8 h-8 flex items-center justify-center transition-all text-lg"
            >
              ✕
            </button>
          </div>

          {/* ── Body ── */}
          <div className="p-8">
            {/* Title */}
            <Field label="Task Title" required>
              <input
                type="text"
                value={task.title || ""}
                disabled={!editing}
                placeholder="Enter task title..."
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                className={`${inputClass} ${submitted && !task.title?.trim() ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.1)]" : ""}`}
              />
              {submitted && !task.title?.trim() && (
                <p className="text-xs text-red-400 mt-1">Title is required</p>
              )}
            </Field>

            {/* Description */}
            <Field label="Description">
              <textarea
                rows="3"
                value={task.description || ""}
                disabled={!editing}
                placeholder="Add a description..."
                onChange={(e) =>
                  setTask({ ...task, description: e.target.value })
                }
                className={`${inputClass} resize-none`}
              />
            </Field>

            {/* Due Date + Status */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <Field label="Due Date">
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
              </Field>
              <Field label="Status">
                <select
                  value={task.status || "todo"}
                  disabled={!editing}
                  onChange={(e) => setTask({ ...task, status: e.target.value })}
                  className={inputClass}
                >
                  <option value="todo">📋 To Do</option>
                  <option value="in progress">⏳ In Progress</option>
                  <option value="done">✅ Done</option>
                </select>
              </Field>
            </div>

            {/* Assign To — hanya tampil jika members tersedia */}
            {members.length > 0 ? (
              <Field label="Assigned To">
                {editing ? (
                  <select
                    value={
                      task.assigned_to_id !== undefined
                        ? (task.assigned_to_id ?? "")
                        : (task.assigned_to?.id ?? "")
                    }
                    onChange={(e) => {
                      const selectedMember =
                        members.find((m) => m.id === e.target.value) || null;
                      setTask({
                        ...task,
                        assigned_to_id:
                          e.target.value === "" ? null : e.target.value,
                        assigned_to: selectedMember, // update assigned_to ke member yang dipilih
                      });
                    }}
                    className={inputClass}
                  >
                    <option value="">— Unassigned —</option>
                    {members.filter(Boolean).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.full_name} ({m.username})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                    {assignedMember ? (
                      <>
                        <Avatar full_name={assignedMember.full_name} />
                        <div>
                          <p className="text-sm font-medium text-gray-800 leading-none">
                            {assignedMember.full_name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            @{assignedMember.username}
                          </p>
                        </div>
                      </>
                    ) : (
                      <span className="text-sm text-gray-400 italic">
                        Unassigned
                      </span>
                    )}
                  </div>
                )}
              </Field>
            ) : task.assigned_to ? (
              // Dashboard — tidak ada members, tampil assigned_to dari task langsung (read-only)
              <Field label="Assigned To">
                <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                  <Avatar full_name={task.assigned_to.full_name} />
                  <div>
                    <p className="text-sm font-medium text-gray-800 leading-none">
                      {task.assigned_to.full_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      @{task.assigned_to.username}
                    </p>
                  </div>
                </div>
              </Field>
            ) : null}
          </div>

          {/* ── Footer ── */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            {/* Left: Delete */}
            <div>
              {!isCreating && onDelete && !editing && (
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={loading}
                  className="px-4 py-2 text-red-500 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50 transition disabled:opacity-60"
                >
                  🗑 Delete
                </button>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex gap-3">
              {editing ? (
                <>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      isCreating ? onClose() : setEditing(false);
                    }}
                    disabled={loading}
                    className="px-5 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-60 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : isCreating ? (
                      "✨ Create Task"
                    ) : (
                      "✓ Save Changes"
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
                  >
                    ✏️ Edit
                  </button>
                </>
              )}
            </div>
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
