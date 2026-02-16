import React, { useState } from "react";
import { toUTCISOString, toInputDateTime } from "../../utils/dateUtils";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { useNotification } from "../../context/NotificationContext";
import "./TaskModal.css";

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

  const handleDelete = () => {
    setShowConfirm(true);
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
      <div className="modal-overlay" onClick={onClose}>
        <div className="task-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{editing ? "✏ Edit Task" : "📋 Task Details"}</h2>
            <button className="btn-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="modal-body">
            <div className="form-group">
              <label>Task Title *</label>
              <input
                type="text"
                value={task.title || ""}
                disabled={!editing}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="4"
                value={task.description || ""}
                disabled={!editing}
                onChange={(e) =>
                  setTask({
                    ...task,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Due Date</label>
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
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={task.status || "todo"}
                  disabled={!editing}
                  onChange={(e) =>
                    setTask({
                      ...task,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="todo">To Do</option>
                  <option value="in progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {editing ? (
              <>
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "✓ Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  🗑 Delete
                </button>

                <button className="btn btn-secondary" onClick={onClose}>
                  Close
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => setEditing(true)}
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
