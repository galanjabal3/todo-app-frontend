import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { groupAPI, taskAPI } from "../../services/api";
import { formatDisplayDateTime, toUTCISOString } from "../../utils/dateUtils";
import { useNotification } from "../../context/NotificationContext";
import {
  inputClass,
  btnPrimary,
  btnSecondary,
  btnDanger,
} from "../../utils/styles";
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

// Reusable spinner SVG
const Spinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

// Reusable confirm modal for destructive actions
const ConfirmActionModal = ({
  onClose,
  onConfirm,
  loading,
  icon,
  title,
  description,
  confirmText,
  confirmClass,
}) => (
  <div
    className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex justify-center items-center z-[1000] p-4"
    onClick={onClose}
  >
    <div
      className="w-full max-w-[380px] bg-card rounded-2xl shadow-2xl p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-app text-center mb-1">{title}</h3>
      <p className="text-sm text-soft text-center mb-6">{description}</p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={loading}
          className={`flex-1 ${btnSecondary}`}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`flex-1 py-2.5 rounded-lg font-semibold transition text-sm flex items-center justify-center gap-2 disabled:opacity-60 ${confirmClass}`}
        >
          {loading ? (
            <>
              <Spinner />
              {confirmText}ing...
            </>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </div>
  </div>
);

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
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [removingMemberId, setRemovingMemberId] = useState(null);
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

  const handleCreateTask = async (newTask) => {
    try {
      const dataToSend = {
        ...newTask,
        group_id: groupId,
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

  const handleReject = async (userId) => {
    try {
      await groupAPI.approveMember(groupId, userId, false);
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

  const handleRemoveMember = async (memberId) => {
    setRemovingMemberId(memberId);
    try {
      await groupAPI.removeMember(groupId, memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      showNotification({ type: "success", message: "Member removed" });
    } catch (error) {
      showNotification({
        type: "error",
        message: error?.message || "Failed to remove member",
      });
    } finally {
      setRemovingMemberId(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-app">
        <Loading text="Loading group..." />
      </div>
    );
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
      <div className="min-h-screen bg-app">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
          {/* Back */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition mb-6 cursor-pointer"
          >
            ← Back to Dashboard
          </button>

          {/* Group Header */}
          <div className="bg-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm border border-app mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl ${getAvatarColor(group.name)} text-white flex items-center justify-center text-xl font-bold`}
              >
                {getInitials(group.name)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-app">{group.name}</h1>
                <p className="text-sm text-soft mt-1">
                  Created by {admin?.full_name} · {activeMembers?.length || 0}{" "}
                  {activeMembers?.length === 1 ? "member" : "members"}
                </p>
                {group.description && (
                  <p className="text-sm text-muted-app mt-1">
                    {group.description}
                  </p>
                )}
              </div>
            </div>

            <div>
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditGroupName(group.name);
                      setShowEditGroup(true);
                    }}
                    className="px-3 py-2 border border-app text-soft text-sm rounded-lg font-semibold hover:bg-hover transition flex items-center gap-1.5 cursor-pointer"
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
                    className={btnDanger}
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
                  className={btnDanger}
                >
                  Leave Group
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <TaskOverview tasks={tasks} />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tasks */}
            <div className="lg:col-span-2">
              <TaskList
                tasks={tasks}
                members={activeMembers}
                title="Group Tasks"
                showFilter={true}
                onStatusChange={handleStatusChange}
                onSaveTask={handleSaveTask}
                onCreateTask={handleCreateTask}
                onDeleteTask={handleDeleteTask}
                formatDate={formatDisplayDateTime}
              />
            </div>

            {/* Members */}
            <div className="lg:col-span-1 bg-card rounded-2xl p-6 shadow-sm border border-app self-start">
              <h2 className="text-lg font-semibold text-app mb-6">
                Members ({activeMembers.length})
              </h2>

              {/* Pending Requests — admin only */}
              {isAdmin && pendingMembers.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-muted-app uppercase tracking-wide mb-3">
                    Pending Requests ({pendingMembers.length})
                  </p>
                  <div className="flex flex-col gap-2">
                    {pendingMembers.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${getAvatarColor(m.full_name)} text-white flex items-center justify-center text-sm font-bold`}
                          >
                            {getInitials(m.full_name)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-app">
                              {m.full_name}
                            </div>
                            <div className="text-xs text-soft">
                              @{m.username}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(m.id)}
                            className="px-3 py-1 border border-red-200 dark:border-red-800/60 text-red-500 dark:text-red-400 text-xs font-semibold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition cursor-pointer"
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
                  <div className="border-t border-light my-4" />
                </div>
              )}

              <div className="flex flex-col gap-4">
                {sortedMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-card border border-light hover:border-indigo-300 dark:hover:border-indigo-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full ${getAvatarColor(m.full_name || "")} text-white flex items-center justify-center text-sm font-bold`}
                      >
                        {getInitials(m.full_name || "?")}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-app">
                          {m.name || m.full_name}
                        </div>
                        <div className="text-xs text-soft">
                          {m.role || m.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          m.role === "admin"
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                            : "bg-subtle text-soft"
                        }`}
                      >
                        {m.role === "admin" ? "Admin" : "Member"}
                      </span>

                      {/* Remove button — admin only, cannot remove self */}
                      {isAdmin && m.id !== user?.id && (
                        <button
                          onClick={() => {
                            setMemberToRemove(m);
                            setShowRemoveConfirm(true);
                          }}
                          className="p-1.5 text-muted-app hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          title="Remove member"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {isAdmin && (
                <button
                  onClick={() => setShowInvite(true)}
                  className="w-full mt-6 py-2.5 border border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 rounded-lg font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition cursor-pointer"
                >
                  + Invite Member
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <InviteModal groupId={groupId} onClose={() => setShowInvite(false)} />
      )}

      {/* Edit Group Modal */}
      {showEditGroup && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex justify-center items-center z-[1000] p-4"
          onClick={() => setShowEditGroup(false)}
        >
          <div
            className="w-full max-w-[420px] bg-card rounded-2xl shadow-2xl overflow-hidden"
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
              <label className="block mb-1.5 text-xs font-semibold text-soft uppercase tracking-wide">
                Group Name
              </label>
              <input
                type="text"
                value={editGroupName}
                onChange={(e) => setEditGroupName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEditGroup()}
                maxLength={50}
                autoFocus
                className={inputClass}
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditGroup(false)}
                  className={`flex-1 ${btnSecondary}`}
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
                      <Spinner />
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

      {/* Delete Group Confirm */}
      {showDeleteConfirm && (
        <ConfirmActionModal
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteGroup}
          loading={deleteLoading}
          confirmText="Delete"
          confirmClass="bg-red-500 text-white hover:bg-red-600"
          title="Delete Group?"
          description={
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-app">{group?.name}</span>?
              This action cannot be undone.
            </>
          }
          icon={
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
          }
        />
      )}

      {/* Leave Group Confirm */}
      {showLeaveConfirm && (
        <ConfirmActionModal
          onClose={() => setShowLeaveConfirm(false)}
          onConfirm={handleLeave}
          loading={leaveLoading}
          confirmText="Leave"
          confirmClass="bg-red-500 text-white hover:bg-red-600"
          title="Leave Group?"
          description={
            <>
              Are you sure you want to leave{" "}
              <span className="font-semibold text-app">{group?.name}</span>?
              You'll need a new invite to rejoin.
            </>
          }
          icon={
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
          }
        />
      )}

      {/* Remove Member Confirm */}
      {showRemoveConfirm && memberToRemove && (
        <ConfirmActionModal
          onClose={() => {
            setShowRemoveConfirm(false);
            setMemberToRemove(null);
          }}
          onConfirm={async () => {
            await handleRemoveMember(memberToRemove.id);
            setShowRemoveConfirm(false);
            setMemberToRemove(null);
          }}
          loading={removingMemberId !== null}
          confirmText="Remove"
          confirmClass="bg-red-500 text-white hover:bg-red-600"
          title="Remove Member?"
          description={
            <>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-app">
                {memberToRemove.full_name}
              </span>{" "}
              from this group?
            </>
          }
          icon={
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
                d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
              />
            </svg>
          }
        />
      )}
    </>
  );
};

export default GroupDetail;
