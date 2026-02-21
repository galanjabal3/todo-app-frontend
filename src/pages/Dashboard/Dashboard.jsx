import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskAPI, groupAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import TaskModal from "../../components/TaskModal/TaskModal";
import { formatDisplayDateTime } from "../../utils/dateUtils";
import { useNotification } from "../../context/NotificationContext";
import Loading from "../../components/Loading/Loading";

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

  // status-select classes
  const getStatusClass = (status) => {
    const base =
      "px-3 py-[0.45rem] rounded-[0.6rem] border-none font-medium cursor-pointer text-sm";
    switch (status) {
      case "todo":
        return `${base} bg-gray-200 text-gray-700`;
      case "in progress":
        return `${base} bg-amber-100 text-amber-800`;
      case "done":
        return `${base} bg-green-100 text-green-800`;
      default:
        return base;
    }
  };

  // filter button classes
  const filterBtnClass = (val) =>
    `px-4 py-2 rounded-[0.6rem] border text-sm font-medium cursor-pointer transition-all duration-200 ${
      filter === val
        ? "bg-indigo-500 text-white border-indigo-500"
        : "bg-white border-slate-200 hover:bg-indigo-50"
    }`;

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  if (loading) return <Loading text="Fetching your tasks..." />;

  return (
    <>
      {/* dashboard */}
      <div className="p-10 bg-[#f8fafc] min-h-screen md:p-5">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-10 md:flex-col md:gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">
              Welcome back, {user?.full_name}! 👋
            </h1>
            <p className="text-slate-500">
              Here's what's happening with your tasks today.
            </p>
          </div>
          <button
            onClick={() => navigate("/tasks/new")}
            className="px-5 py-[0.65rem] bg-gradient-to-br from-indigo-400 to-indigo-600 text-white rounded-[0.6rem] border-none cursor-pointer font-medium transition-all duration-200 hover:opacity-90"
          >
            ➕ Add Task
          </button>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 mb-10 sm:grid-cols-2">
          {/* Total */}
          <div className="bg-white p-6 rounded-2xl text-center shadow-[0_6px_20px_rgba(0,0,0,0.05)] border-l-4 border-indigo-500">
            <div className="text-[1.8rem] mb-2">📋</div>
            <div className="text-[2.3rem] font-bold text-slate-900">
              {taskStats.total}
            </div>
            <div className="text-slate-500 text-sm">Total Tasks</div>
          </div>

          {/* Todo */}
          <div className="bg-white p-6 rounded-2xl text-center shadow-[0_6px_20px_rgba(0,0,0,0.05)] border-l-4 border-gray-500">
            <div className="text-[1.8rem] mb-2">⏳</div>
            <div className="text-[2.3rem] font-bold text-slate-900">
              {taskStats.todo}
            </div>
            <div className="text-slate-500 text-sm">To Do</div>
          </div>

          {/* In Progress */}
          <div className="bg-white p-6 rounded-2xl text-center shadow-[0_6px_20px_rgba(0,0,0,0.05)] border-l-4 border-amber-400">
            <div className="text-[1.8rem] mb-2">🔄</div>
            <div className="text-[2.3rem] font-bold text-slate-900">
              {taskStats.inProgress}
            </div>
            <div className="text-slate-500 text-sm">In Progress</div>
          </div>

          {/* Done */}
          <div className="bg-white p-6 rounded-2xl text-center shadow-[0_6px_20px_rgba(0,0,0,0.05)] border-l-4 border-emerald-500">
            <div className="text-[1.8rem] mb-2">✅</div>
            <div className="text-[2.3rem] font-bold text-slate-900">
              {taskStats.done}
            </div>
            <div className="text-slate-500 text-sm">Completed</div>
          </div>
        </div>

        {/* MAIN CONTENT — 2 col */}
        <div className="grid grid-cols-[2fr_1fr] gap-8 lg:grid-cols-1">
          {/* ── TASKS SECTION ── */}
          <div>
            {/* Section Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[1.4rem] font-semibold">My Tasks</h2>

              {/* Filter Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  className={filterBtnClass("all")}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={filterBtnClass("todo")}
                  onClick={() => setFilter("todo")}
                >
                  To Do
                </button>
                <button
                  className={filterBtnClass("in progress")}
                  onClick={() => setFilter("in progress")}
                >
                  In Progress
                </button>
                <button
                  className={filterBtnClass("done")}
                  onClick={() => setFilter("done")}
                >
                  Done
                </button>
              </div>
            </div>

            {/* Task List */}
            <div className="flex flex-col gap-5">
              {filteredTasks.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl text-center border border-slate-100">
                  <div className="text-5xl mb-4">📝</div>
                  <p>No tasks found.</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      setSelectedTask(task);
                      setEditingTask(false);
                    }}
                    className="bg-white p-6 rounded-2xl flex justify-between gap-4 border border-slate-100 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] md:flex-col"
                  >
                    {/* Task Info */}
                    <div className="task-info">
                      <h3 className="text-[1.1rem] font-semibold mb-1 text-slate-900">
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-slate-500 mb-3 text-sm">
                          {task.description}
                        </p>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        {task.due_date && (
                          <span className="bg-slate-100 px-3 py-[0.35rem] rounded-lg text-xs text-slate-600">
                            {formatDisplayDateTime(task.due_date)}
                          </span>
                        )}
                        {task.group_id && (
                          <span className="bg-slate-100 px-3 py-[0.35rem] rounded-lg text-xs text-slate-600">
                            👥{" "}
                            {groups.find((g) => g.id === task.group_id)?.name ||
                              "Group"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Select */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <select
                        value={task.status}
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

          {/* ── GROUPS SECTION ── */}
          <div>
            {/* Section Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[1.4rem] font-semibold">My Groups</h2>
              <button
                onClick={() => navigate("/groups/join")}
                className="px-4 py-2 bg-slate-200 rounded-lg border-none cursor-pointer font-medium transition-all duration-200 hover:bg-slate-300"
              >
                ➕ Join
              </button>
            </div>

            {/* Group List */}
            <div className="flex flex-col gap-4">
              {groups.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl text-center border border-slate-100">
                  You're not in any groups yet.
                </div>
              ) : (
                groups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => navigate(`/groups/${group.id}`)}
                    className="bg-white p-5 rounded-2xl flex gap-4 items-center border border-slate-100 cursor-pointer transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_8px_18px_rgba(0,0,0,0.06)]"
                  >
                    <div className="text-[1.6rem]">👥</div>
                    <div>
                      <h3 className="font-semibold mb-[0.2rem]">
                        {group.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {group.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TASK MODAL */}
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
