import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskAPI, groupAPI } from "../../services/api";
import { toUTCISOString } from "../../utils/dateUtils";
import { useNotification } from "../../context/NotificationContext";
import "./TaskForm.css";

const AddTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "todo",
    group_id: "",
  });

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await groupAPI.getGroups();
      setGroups(response.data || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        group_id: formData.group_id || null,
        due_date: toUTCISOString(formData.due_date),
      };

      await taskAPI.createTask(dataToSend);

      showNotification({
        open: true,
        type: "success",
        message: "Task created successfully",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      console.error(err);
      showNotification({
        open: true,
        type: "error",
        message: err?.message || "Failed to create task",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <div className="task-form-card">
        <div className="form-header">
          <h1>➕ Add New Task</h1>
          <button className="btn-close" onClick={() => navigate("/dashboard")}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter task title"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="datetime-local"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="todo">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Assign to Group (Optional)</label>
            <select
              name="group_id"
              value={formData.group_id}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Personal Task</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>

            {groups.length === 0 && (
              <small className="form-hint">
                No groups available. Join a group to assign tasks.
              </small>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "✓ Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
