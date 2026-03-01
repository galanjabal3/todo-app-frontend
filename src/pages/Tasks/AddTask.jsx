// NOT USED
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskAPI, groupAPI } from "../../services/api";
import { toUTCISOString } from "../../utils/dateUtils";
import { useNotification } from "../../context/NotificationContext";

const inputClass =
  "w-full px-3 py-3 border border-gray-200 rounded-lg text-base transition-colors duration-200 focus:outline-none focus:border-indigo-600 disabled:opacity-60";

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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setTimeout(() => navigate("/dashboard"), 1200);
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
    <>
      {/* task-form-container */}
      <div className="p-8 max-w-[800px] mx-auto md:p-4">
        {/* task-form-card */}
        <div className="bg-white p-8 rounded-2xl shadow-md md:p-6">
          {/* form-header */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <h1 className="text-[1.75rem] font-bold m-0 flex items-center gap-2 md:text-2xl">
              ➕ Add New Task
            </h1>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-transparent border-none text-2xl cursor-pointer text-gray-500 p-2 leading-none rounded transition-all hover:text-gray-900 hover:bg-gray-50"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-900 text-sm">
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter task title"
                disabled={loading}
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-900 text-sm">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                rows="4"
                disabled={loading}
                className={`${inputClass} resize-y font-inherit`}
              />
            </div>

            {/* form-row: Due Date + Status */}
            <div className="grid grid-cols-2 gap-4 mb-5 md:grid-cols-1">
              <div>
                <label className="block mb-2 font-medium text-gray-900 text-sm">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-900 text-sm">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass}
                >
                  <option value="todo">To Do</option>
                  <option value="in progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            {/* Group */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-900 text-sm">
                Assign to Group (Optional)
              </label>
              <select
                name="group_id"
                value={formData.group_id}
                onChange={handleChange}
                disabled={loading}
                className={inputClass}
              >
                <option value="">Personal Task</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              {groups.length === 0 && (
                <small className="block mt-2 text-xs text-gray-500 italic">
                  No groups available. Join a group to assign tasks.
                </small>
              )}
            </div>

            {/* form-actions */}
            <div className="flex gap-4 justify-end mt-6 md:flex-col-reverse">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
                className="px-5 py-[0.625rem] bg-white text-gray-900 border border-gray-200 rounded-lg font-medium cursor-pointer transition-all hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-[0.625rem] bg-indigo-600 text-white rounded-lg font-medium cursor-pointer transition-all hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {loading ? "Creating..." : "✓ Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddTask;
