import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const [showInvite, setShowInvite] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editGroupName, setEditGroupName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
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

  // Handle leave group
  const handleLeave = async () => {
    setLeaveLoading(true);
    try {
      await groupAPI.leaveGroup(groupId);
      showNotification({
        open: true,
        type: "success",
        message: "You have left the group",
      });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      showNotification({
        open: true,
        type: "error",
        message: error?.message || "Failed to leave group",
      });
    } finally {
      setLeaveLoading(false);
      setShowLeaveConfirm(false);
    }
  };

  // Handlers
  const handleEditGroup = async () => {
    if (!editGroupName.trim()) return;
    setEditLoading(true);
    try {
      const updated = await groupAPI.updateGroup(groupId, {
        name: editGroupName,
      });
      showNotification({
        type: "success",
        message: "Group updated successfully",
      });
      setGroup(updated);
      setShowEditGroup(false);
    } catch (error) {
      showNotification({
        type: "error",
        message: error?.message || "Failed to update group",
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    setDeleteLoading(true);
    try {
      await groupAPI.deleteGroup(groupId);
      showNotification({
        type: "success",
        message: "Group deleted successfully",
      });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      showNotification({
        type: "error",
        message: error?.message || "Failed to delete group",
      });
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
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

            {/* Group Header actions */}
            <div>
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditGroupName(group.name);
                      setShowEditGroup(true);
                    }}
                    className="px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg font-semibold hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 py-2 border border-red-200 text-red-500 text-sm rounded-lg font-semibold hover:bg-red-50 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              )}

              {!isAdmin && (
                <button
                  onClick={() => setShowLeaveConfirm(true)}
                  className="px-3 py-2 border border-red-200 text-red-500 text-sm rounded-lg font-semibold hover:bg-red-50 transition cursor-pointer"
                >
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
                  className="w-full mt-6 py-2.5 border border-dashed border-indigo-300 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition cursor-pointer"
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

      {showEditGroup && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000] p-4"
          onClick={() => setShowEditGroup(false)}
        >
          <div
            className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 flex justify-between items-center">
              <div>
                <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest mb-0.5">
                  Edit Group
                </p>
                <h2 className="text-white text-lg font-semibold flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Group
                </h2>
              </div>
              <button
                onClick={() => setShowEditGroup(false)}
                className="text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg w-8 h-8 flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <label className="block mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Group Name
              </label>
              <input
                type="text"
                value={editGroupName}
                onChange={(e) => setEditGroupName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEditGroup()}
                maxLength={50}
                autoFocus
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]"
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditGroup(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditGroup}
                  disabled={!editGroupName.trim() || editLoading}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {editLoading ? (
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
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000] p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="w-full max-w-[380px] bg-white rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-1">
              Delete Group?
            </h3>
            <p className="text-sm text-slate-400 text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-600">
                {group?.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGroup}
                disabled={deleteLoading}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition text-sm flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
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
                    Deleting...
                  </>
                ) : (
                  "Delete Group"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Confirm Modal */}
      {showLeaveConfirm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000] p-4"
          onClick={() => setShowLeaveConfirm(false)}
        >
          <div
            className="w-full max-w-[380px] bg-white rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center mb-1">
              Leave Group?
            </h3>
            <p className="text-sm text-slate-400 text-center mb-6">
              Are you sure you want to leave{" "}
              <span className="font-semibold text-slate-600">
                {group?.name}
              </span>
              ? You'll need a new invite to rejoin.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                disabled={leaveLoading}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLeave}
                disabled={leaveLoading}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition text-sm flex items-center justify-center gap-2"
              >
                {leaveLoading ? (
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
                    Leaving...
                  </>
                ) : (
                  "Leave Group"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupDetail;
