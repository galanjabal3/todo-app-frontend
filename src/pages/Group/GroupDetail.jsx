import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { groupAPI, taskAPI } from "../../services/api";
import { formatDisplayDateTime, toUTCISOString } from "../../utils/dateUtils";
import { useNotification } from "../../context/NotificationContext";
import TaskList from "../../components/Task/TaskList";
import TaskOverview from "../../components/Task/TaskOverview";
import Loading from "../../components/Loading/Loading";
import ErrorStatePage from "../../components/PageError/ErrorStatePage";
import InviteModal from "../../components/Group/InviteModal";

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

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

const GroupDetail = () => {
  const { user } = useAuth();
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const [showInvite, setShowInvite] = useState(false);
  const admin = members.find((m) => m.role === "admin");
  const isAdmin = members.find((m) => m.id === user?.id)?.role === "admin";
  const isMember = members.find((m) => m.id === user?.id);
  const pendingMembers = members.filter((m) => m.role === "pending");
  const activeMembers = members.filter((m) => m.role !== "pending");
  const sortedMembers = [...activeMembers].sort((a, b) => {
    if (a.role === "admin") return -1;
    if (b.role === "admin") return 1;
    return 0;
  });

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      const [groupRes, tasksRes] = await Promise.all([
        groupAPI.getGroup(groupId),
        groupAPI.getGroupTasks(groupId),
      ]);
      setGroup(groupRes);
      setMembers(groupRes.members || []);
      setTasks(tasksRes || []);
    } catch (error) {
      console.error("Error fetching group data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update status inline — sama seperti Dashboard tapi pakai groupAPI
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
        message: "Status update failed",
      });
    }
  };

  // Save task setelah edit di TaskModal
  const handleSaveTask = async (updatedTask) => {
    try {
      await taskAPI.updateTask(updatedTask.id, updatedTask);
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
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
        message: error?.description?.message || "Task update failed",
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
        message: error?.description?.message || "Failed to delete task",
      });
    }
  };

  // Handle create task from TaskModal
  const handleCreateTask = async (newTask) => {
    try {
      const dataToSend = {
        ...newTask,
        group_id: groupId, // ← pastikan group_id dari useParams
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
      console.error(error);
      showNotification({
        open: true,
        type: "error",
        message: error?.description?.message || "Failed to create task",
      });
    }
  };

  const handleApprove = async (userId) => {
    try {
      await groupAPI.approveMember(groupId, userId);
      // Update local state — pindah dari pending ke member
      setMembers((prev) =>
        prev.map((m) => (m.id === userId ? { ...m, role: "member" } : m)),
      );
      showNotification({
        open: true,
        type: "success",
        message: "Member approved",
      });
    } catch (error) {
      console.error(error);
      showNotification({
        open: true,
        type: "error",
        message: "Failed to approve member",
      });
    }
  };

  // Sementara pakai handler kosong dulu sampai BE ready
  const handleReject = async (userId) => {
    try {
      await groupAPI.approveMember(groupId, userId, false); // ← sesuaikan endpoint
      setMembers((prev) => prev.filter((m) => m.id !== userId));
      showNotification({
        open: true,
        type: "success",
        message: "Member rejected",
      });
    } catch (error) {
      showNotification({
        open: true,
        type: "error",
        message: "Failed to reject member",
      });
    }
  };

  if (loading) return <Loading text="Loading group..." />;
  if (!group) return null;
  if (!loading && !isMember)
    return (
      <ErrorStatePage
        type="forbidden"
        description="You are not part of this group"
      />
    );

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
          {/* Back */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition mb-6 cursor-pointer"
          >
            ← Back to Dashboard
          </button>

          {/* ── Group Header ── */}
          <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm border border-slate-100 mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl ${getAvatarColor(group.name)} text-white flex items-center justify-center text-xl font-bold`}
              >
                {getInitials(group.name)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {group.name}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Created by {admin?.full_name} · {activeMembers?.length || 0}{" "}
                  {activeMembers?.length === 1 ? "member" : "members"}
                </p>
                {group.description && (
                  <p className="text-sm text-slate-400 mt-1">
                    {group.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {!isAdmin && (
                <button className="px-4 py-2 border border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition">
                  Leave Group
                </button>
              )}
            </div>
          </div>

          {/* ── Stats ── */}
          <TaskOverview tasks={tasks} />

          {/* ── Main Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Tasks ── */}
            <div className="lg:col-span-2">
              <TaskList
                tasks={tasks}
                members={activeMembers}
                title="Group Tasks"
                showFilter={true}
                onStatusChange={handleStatusChange} // ← select box aktif
                onSaveTask={handleSaveTask} // ← edit task via modal
                onCreateTask={handleCreateTask} // ← create task via modal
                onDeleteTask={handleDeleteTask} // ← delete task via modal
                formatDate={formatDisplayDateTime}
              />
            </div>

            {/* ── Members ── */}
            <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 self-start">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                Members ({activeMembers.length})
              </h2>
              {/* Pending Requests — hanya tampil untuk admin */}
              {isAdmin && pendingMembers.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                    Pending Requests ({pendingMembers.length})
                  </p>
                  <div className="flex flex-col gap-2">
                    {pendingMembers.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${getAvatarColor(m.full_name)} text-white flex items-center justify-center text-sm font-bold`}
                          >
                            {getInitials(m.full_name)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {m.full_name}
                            </div>
                            <div className="text-xs text-slate-500">
                              @{m.username}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(m.id)}
                            className="px-3 py-1 border border-red-200 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-50 transition cursor-pointer"
                          >
                            ✕
                          </button>
                          <button
                            onClick={() => handleApprove(m.id)}
                            className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                          >
                            ✓ Approve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 my-4" />
                </div>
              )}
              <div className="flex flex-col gap-4">
                {sortedMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 hover:border-indigo-200 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full ${getAvatarColor(m.full_name || "")} text-white flex items-center justify-center text-sm font-bold`}
                      >
                        {getInitials(m.full_name || "?")}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {m.name || m.full_name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {m.role || m.email}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        m.role === "admin"
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {m.role === "admin" ? "Admin" : "Member"}
                    </span>
                  </div>
                ))}
              </div>

              {isAdmin && (
                <button
                  onClick={() => setShowInvite(true)}
                  className="w-full mt-6 py-2.5 border border-dashed border-indigo-300 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
                >
                  + Invite Member
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showInvite && (
        <InviteModal groupId={groupId} onClose={() => setShowInvite(false)} />
      )}
    </>
  );
};

export default GroupDetail;
