import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskAPI, groupAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { formatDisplayDateTime, toUTCISOString } from "../../utils/dateUtils";
import { useNotification } from "../../context/NotificationContext";
import { inputClass } from "../../utils/styles";
import Loading from "../../components/Loading/Loading";
import TaskList from "../../components/Task/TaskList";
import TaskOverview from "../../components/Task/TaskOverview";

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
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [createGroupName, setCreateGroupName] = useState("");
  const [createGroupLoading, setCreateGroupLoading] = useState(false);

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
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      );
      showNotification({
        open: true,
        type: "success",
        message: "Status updated successfully",
      });
    } catch (error) {
      showNotification({
        open: true,
        type: "error",
        message: "Failed to update status",
      });
    }
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      const dataToSend = {
        ...updatedTask,
        assigned_to_id:
          updatedTask.assigned_to?.id ?? updatedTask.assigned_to_id ?? null,
        due_date: updatedTask.due_date
          ? toUTCISOString(updatedTask.due_date)
          : null,
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
      showNotification({
        open: true,
        type: "error",
        message: "Failed to update task",
      });
    }
  };

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
    } catch (error) {
      showNotification({
        open: true,
        type: "error",
        message: error?.message || "Failed to create task",
      });
    }
  };

  const handleCreateGroup = async () => {
    if (!createGroupName.trim()) return;
    setCreateGroupLoading(true);
    try {
      await groupAPI.createGroup({ name: createGroupName });
      showNotification({
        type: "success",
        message: "Group created successfully",
      });
      setCreateGroupName("");
      setShowCreateGroup(false);
      fetchData();
    } catch (error) {
      showNotification({
        type: "error",
        message: error?.message || "Failed to create group",
      });
    } finally {
      setCreateGroupLoading(false);
    }
  };

  if (loading) return <Loading text="Fetching your tasks..." />;

  return (
    <>
      <div className="min-h-screen bg-app transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
          {/* ── Header ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-app mb-1">
                Welcome back, {user?.full_name}! 👋
              </h1>
              <p className="text-soft">
                Here's what's happening with your tasks today.
              </p>
            </div>
          </div>

          {/* ── Stats ── */}
          <TaskOverview tasks={tasks} />

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tasks */}
            <div className="lg:col-span-2">
              <TaskList
                tasks={tasks}
                title="My Tasks"
                showFilter={true}
                onStatusChange={handleStatusChange}
                onSaveTask={handleSaveTask}
                onCreateTask={handleCreateTask}
                onDeleteTask={handleDeleteTask}
                groups={groups}
                formatDate={formatDisplayDateTime}
              />
            </div>

            {/* Groups */}
            <div className="lg:col-span-1 bg-card rounded-2xl p-6 shadow-sm border border-app self-start transition-colors duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-app">My Groups</h2>
                <button
                  onClick={() => setShowCreateGroup(true)}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg font-semibold hover:bg-indigo-700 transition cursor-pointer"
                >
                  + New Group
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {groups.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-muted-app">
                    <svg
                      className="w-12 h-12 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      style={{ color: "var(--text-muted)" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-soft">
                      No groups yet
                    </p>
                    <p className="text-xs text-muted-app mt-1">
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
                        className={`p-3 rounded-xl border transition flex gap-3 items-center
                          ${
                            isPending
                              ? "border-app opacity-75 cursor-default"
                              : "border-app hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-subtle cursor-pointer"
                          }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl ${getGroupAvatarColor(group.name)} text-white flex items-center justify-center text-sm font-bold flex-shrink-0`}
                        >
                          {getGroupInitials(group.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-app truncate">
                            {group.name}
                          </h3>
                          <p className="text-sm text-soft">
                            {activeMembers?.length || 0}{" "}
                            {activeMembers?.length === 1 ? "member" : "members"}
                          </p>
                        </div>
                        {isPending ? (
                          <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                            Pending
                          </span>
                        ) : (
                          <span className="ml-auto text-muted-app text-sm flex-shrink-0">
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

      {/* ── Create Group Modal ── */}
      {showCreateGroup && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex justify-center items-center z-[1000] p-4"
          onClick={() => setShowCreateGroup(false)}
        >
          <div
            className="w-full max-w-[420px] bg-card rounded-2xl shadow-2xl overflow-hidden transition-colors duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 flex justify-between items-center">
              <div>
                <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest mb-0.5">
                  New Group
                </p>
                <h2 className="text-white text-lg font-semibold">
                  👥 Create Group
                </h2>
              </div>
              <button
                onClick={() => setShowCreateGroup(false)}
                className="text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg w-8 h-8 flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <label className="block mb-1.5 text-xs font-semibold text-soft uppercase tracking-wide">
                Group Name
              </label>
              <input
                type="text"
                value={createGroupName}
                onChange={(e) => setCreateGroupName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateGroup()}
                placeholder="Enter group name..."
                maxLength={50}
                autoFocus
                className={inputClass}
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateGroup(false);
                    setCreateGroupName("");
                  }}
                  className="flex-1 py-2.5 border border-app text-soft rounded-lg font-semibold hover:bg-subtle transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!createGroupName.trim() || createGroupLoading}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {createGroupLoading ? (
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
                      Creating...
                    </>
                  ) : (
                    "Create Group"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
