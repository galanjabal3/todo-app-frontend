import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskAPI, groupAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { formatDisplayDateTime, toUTCISOString } from "../../utils/dateUtils";
import { useNotification } from "../../context/NotificationContext";
import Loading from "../../components/Loading/Loading";
import TaskList from "../../components/Task/TaskList";
import TaskOverview from "../../components/Task/TaskOverview";

// ── Tambahkan helper avatar di atas komponen Dashboard
const getGroupAvatarColor = (name = "") => {
  const colors = [
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-cyan-500",
    "bg-rose-500",
    "bg-amber-500",
  ];
  const index = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[index % colors.length];
};

const getGroupInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

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

  // Update status inline (dari select box di TaskCard)
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      );
      showNotification({
        open: true,
        type: "success",
        message: "Status updated successfully",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      showNotification({
        open: true,
        type: "error",
        message: "Failed to update status",
      });
    }
  };

  // Save task setelah edit di TaskModal
  const handleSaveTask = async (updatedTask) => {
    try {
      const dataToSend = {
        ...updatedTask,
        assigned_to_id:
          updatedTask.assigned_to?.id ?? updatedTask.assigned_to_id ?? null,
      };
      await taskAPI.updateTask(dataToSend.id, dataToSend);
      setTasks((prev) =>
        prev.map((t) => (t.id === dataToSend.id ? dataToSend : t)),
      );
      showNotification({
        open: true,
        type: "success",
        message: "Task updated successfully",
      });
    } catch (error) {
      console.error("Error saving task:", error);
      showNotification({
        open: true,
        type: "error",
        message: "Failed to update task",
      });
    }
  };

  // Delete task dari TaskModal
  const handleDeleteTask = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showNotification({
        open: true,
        type: "success",
        message: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      showNotification({
        open: true,
        type: "error",
        message: "Failed to delete task",
      });
    }
  };

  const handleCreateTask = async (newTask) => {
    try {
      const dataToSend = {
        ...newTask,
        group_id: newTask.group_id || null,
        due_date: newTask.due_date ? toUTCISOString(newTask.due_date) : null,
      };
      const created = await taskAPI.createTask(dataToSend);
      setTasks((prev) => [...prev, created]);
      showNotification({
        open: true,
        type: "success",
        message: "Task created successfully",
      });
    } catch (err) {
      console.error(err);
      showNotification({
        open: true,
        type: "error",
        message: err?.message || "Failed to create task",
      });
    }
  };

  if (loading) return <Loading text="Fetching your tasks..." />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">
              Welcome back, {user?.full_name}! 👋
            </h1>
            <p className="text-slate-500">
              Here's what's happening with your tasks today.
            </p>
          </div>
        </div>
        {/* ── STATS ── */}
        <TaskOverview tasks={tasks} />

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── TASKS ── */}
          <div className="lg:col-span-2">
            <TaskList
              tasks={tasks}
              title="My Tasks"
              showFilter={true}
              onStatusChange={handleStatusChange}
              onSaveTask={handleSaveTask}
              onCreateTask={handleCreateTask} // ← create task via modal
              onDeleteTask={handleDeleteTask}
              groups={groups}
              formatDate={formatDisplayDateTime}
            />
          </div>

          {/* ── GROUPS ── */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 self-start">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                My Groups
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {/* Empty state groups — lebih bagus */}
              {groups.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-slate-400">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl mb-3">
                    <svg
                      className="w-10 h-10 text-slate-300 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    No groups yet
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    Ask your team for an invite link
                  </p>
                </div>
              ) : (
                groups.map((group) => {
                  const myRole = group.members?.find(
                    (m) => m.id === user?.id,
                  )?.role;
                  const isPending = myRole === "pending";
                  const activeMembers = group.members.filter(
                    (m) => m.role !== "pending",
                  );

                  return (
                    <div
                      key={group.id}
                      onClick={() =>
                        !isPending && navigate(`/groups/${group.id}`)
                      }
                      className={`p-3 rounded-xl border border-slate-100 transition flex gap-3 items-center
                      ${
                        isPending
                          ? "opacity-75 cursor-default"
                          : "hover:border-indigo-200 hover:bg-slate-50 cursor-pointer"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl ${getGroupAvatarColor(group.name)} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}
                      >
                        {getGroupInitials(group.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {group.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {activeMembers?.length || 0}{" "}
                          {activeMembers?.length === 1 ? "member" : "members"}
                        </p>
                      </div>
                      {isPending ? (
                        <span className="text-xs bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                          Pending
                        </span>
                      ) : (
                        <span className="ml-auto text-slate-300 text-sm flex-shrink-0">
                          ›
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
