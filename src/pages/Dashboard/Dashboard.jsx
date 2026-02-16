import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskAPI, groupAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import TaskModal from "../../components/TaskModal/TaskModal";
import { formatDisplayDateTime } from "../../utils/dateUtils";
import { useNotification } from "../../context/NotificationContext";
import "./Dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(false);
  const { showNotification } = useNotification();

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, groupsResponse] = await Promise.all([
        taskAPI.getTasks(),
        groupAPI.getMyGroups(),
      ]);

      setTasks(tasksResponse || []);
      setGroups(groupsResponse || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      showNotification({
        open: true,
        type: "success",
        message: "Status update successfully",
      });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task,
        ),
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      showNotification({
        open: true,
        type: "error",
        message: "Status update failed",
      });
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "todo":
        return "status-select status-todo";
      case "in progress":
        return "status-select status-progress";
      case "done":
        return "status-select status-done";
      default:
        return "status-select";
    }
  };

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <div className="dashboard">
        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.full_name}! 👋</h1>
            <p className="subtitle">
              Here's what's happening with your tasks today.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() => navigate("/tasks/new")}
          >
            ➕ Add Task
          </button>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-value">{taskStats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>

          <div className="stat-card stat-todo">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">{taskStats.todo}</div>
            <div className="stat-label">To Do</div>
          </div>

          <div className="stat-card stat-progress">
            <div className="stat-icon">🔄</div>
            <div className="stat-value">{taskStats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>

          <div className="stat-card stat-done">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{taskStats.done}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="dashboard-content">
          {/* TASK SECTION */}
          <div className="tasks-section">
            <div className="section-header">
              <h2>My Tasks</h2>

              <div className="filter-buttons">
                <button
                  className={filter === "all" ? "active" : ""}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={filter === "todo" ? "active" : ""}
                  onClick={() => setFilter("todo")}
                >
                  To Do
                </button>
                <button
                  className={filter === "in progress" ? "active" : ""}
                  onClick={() => setFilter("in progress")}
                >
                  In Progress
                </button>
                <button
                  className={filter === "done" ? "active" : ""}
                  onClick={() => setFilter("done")}
                >
                  Done
                </button>
              </div>
            </div>

            <div className="tasks-list">
              {filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <p>No tasks found.</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="task-card clickable"
                    onClick={() => {
                      setSelectedTask(task);
                      setEditingTask(false);
                    }}
                  >
                    <div className="task-info">
                      <h3>{task.title}</h3>

                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}

                      <div className="task-meta">
                        {task.due_date && (
                          <span className="task-date">
                            {formatDisplayDateTime(task.due_date)}
                          </span>
                        )}

                        {task.group_id && (
                          <span className="task-group">
                            👥 {groups.find((g) => g.id === task.group_id)?.name ||
                              "Group"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="task-actions">
                      <select
                        value={task.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleStatusChange(task.id, e.target.value)
                        }
                        className={getStatusClass(task.status)}
                      >
                        <option value="todo">To Do</option>
                        <option value="in progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* GROUP SECTION */}
          <div className="groups-section">
            <div className="section-header">
              <h2>My Groups</h2>

              <button
                className="btn-secondary"
                onClick={() => navigate("/groups/join")}
              >
                ➕ Join
              </button>
            </div>

            <div className="groups-list">
              {groups.length === 0 ? (
                <div className="empty-state-small">
                  You're not in any groups yet.
                </div>
              ) : (
                groups.map((group) => (
                  <div key={group.id} className="group-card">
                    <div className="group-icon">👥</div>
                    <div>
                      <h3>{group.name}</h3>
                      <p>{group.members?.length || 0} members</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <TaskModal
        task={selectedTask}
        editing={editingTask}
        setEditing={setEditingTask}
        setTask={setSelectedTask}
        onClose={() => setSelectedTask(null)}
        onSave={async () => {
          await taskAPI.updateTask(selectedTask.id, selectedTask);

          setTasks((prev) =>
            prev.map((t) => (t.id === selectedTask.id ? selectedTask : t)),
          );

          setEditingTask(false);
        }}
        onDelete={async () => {
          await taskAPI.deleteTask(selectedTask.id);

          setTasks((prev) =>
            prev.filter((task) => task.id !== selectedTask.id),
          );

          setEditingTask(false);
        }}
      />
    </>
  );
};

export default Dashboard;
