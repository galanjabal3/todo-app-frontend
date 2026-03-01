import { useState } from "react";
import TaskModal from "./TaskModal";

// ── Status mapping ─────────────────────────────────────────────────────────────

const NORMALIZE_STATUS = {
  todo: "To Do",
  "in progress": "In Progress",
  done: "Done",
  "To Do": "To Do",
  "In Progress": "In Progress",
  Done: "Done",
};

const DENORMALIZE_STATUS = {
  "To Do": "todo",
  "In Progress": "in progress",
  Done: "done",
};

const STATUS_CONFIG = {
  "To Do": {
    badge: "bg-indigo-50 text-indigo-600",
    selectBg: "bg-gray-100 text-gray-700",
    dot: "bg-indigo-400",
    icon: "📋",
  },
  "In Progress": {
    badge: "bg-amber-50 text-amber-600",
    selectBg: "bg-amber-100 text-amber-800",
    dot: "bg-amber-400",
    icon: "⏳",
  },
  Done: {
    badge: "bg-green-50 text-green-700",
    selectBg: "bg-green-100 text-green-800",
    dot: "bg-green-500",
    icon: "✅",
  },
};

const FILTERS = ["All", "To Do", "In Progress", "Done"];

const VIEW_KEY = "tasklist_view"; // key untuk localStorage

// ── Normalizer ─────────────────────────────────────────────────────────────────

const normalizeTask = (task, groups = [], formatDate) => {
  const isDashboard = "title" in task;
  const status = NORMALIZE_STATUS[task.status] || "To Do";

  let due = null;
  if (isDashboard && task.due_date) {
    due = formatDate ? formatDate(task.due_date) : task.due_date;
  } else if (!isDashboard && task.due) {
    due = task.due;
  }

  let groupLabel = null;
  if (isDashboard && task.group_id) {
    const g = groups.find((g) => g.id === task.group_id);
    groupLabel = g?.name || "Group";
  }

  return {
    _raw: task,
    _isDashboard: isDashboard,
    id: task.id,
    name: isDashboard ? task.title : task.name,
    desc: isDashboard ? task.description : task.desc,
    status,
    due,
    groupLabel,
    assigned_to: task.assigned_to || null,
  };
};

// ── Avatar ─────────────────────────────────────────────────────────────────────

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

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const AssigneeAvatar = ({ full_name, size = "sm" }) => {
  const sizeClass = size === "sm" ? "w-7 h-7 text-[11px]" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${sizeClass} ${getAvatarColor(full_name)} rounded-full text-white flex items-center justify-center font-bold flex-shrink-0`}
      title={full_name}
    >
      {getInitials(full_name)}
    </div>
  );
};

// ── Status controls ────────────────────────────────────────────────────────────

const StatusSelect = ({ status, taskId, onStatusChange }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["To Do"];
  return (
    <select
      value={DENORMALIZE_STATUS[status]}
      onChange={(e) => onStatusChange(taskId, e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className={`px-2 py-1.5 rounded-md text-xs font-semibold border-none cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-indigo-300 ${cfg.selectBg}`}
    >
      <option value="todo">📋 To Do</option>
      <option value="in progress">⏳ In Progress</option>
      <option value="done">✅ Done</option>
    </select>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["To Do"];
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${cfg.badge}`}
    >
      {cfg.icon} {status}
    </span>
  );
};

// ── TaskCard ───────────────────────────────────────────────────────────────────

const TaskCard = ({ normalized, onTaskClick, onStatusChange }) => (
  <div
    onClick={() => onTaskClick?.(normalized)}
    className={`bg-white border border-slate-200 rounded-xl p-4
      shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200
      ${onTaskClick ? "cursor-pointer" : ""}`}
  >
    {/* Row 1: Title + Status */}
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 truncate">
          {normalized.name}
        </h3>
        {normalized.desc && (
          <p className="text-sm text-slate-500 mt-0.5 truncate">
            {normalized.desc}
          </p>
        )}
      </div>
      <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        {onStatusChange ? (
          <StatusSelect
            status={normalized.status}
            taskId={normalized.id}
            onStatusChange={onStatusChange}
          />
        ) : (
          <StatusBadge status={normalized.status} />
        )}
      </div>
    </div>

    {/* Row 2: Avatar + Due date */}
    {(normalized.assigned_to || normalized.due) && (
      <div className="flex items-center gap-2 mt-3">
        {normalized.assigned_to && (
          <AssigneeAvatar full_name={normalized.assigned_to.full_name} />
        )}
        {normalized.assigned_to && normalized.due && (
          <span className="text-slate-300 text-xs">·</span>
        )}
        {normalized.due && (
          <span className="bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1 text-xs text-slate-500 whitespace-nowrap">
            <svg
              className="w-3 h-3 text-slate-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {normalized.due}
          </span>
        )}
      </div>
    )}
  </div>
);

// ── TaskRow ────────────────────────────────────────────────────────────────────

const TaskRow = ({ normalized, onTaskClick, onStatusChange }) => {
  const cfg = STATUS_CONFIG[normalized.status] || STATUS_CONFIG["To Do"];
  return (
    <div
      onClick={() => onTaskClick?.(normalized)}
      className={`flex items-center gap-3 py-3 border-b border-slate-100 last:border-0
        ${onTaskClick ? "cursor-pointer hover:bg-slate-50 -mx-2 px-2 rounded-lg transition" : ""}`}
    >
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
      <span className="flex-1 text-sm font-medium text-slate-800 truncate">
        {normalized.name}
      </span>
      {normalized.assigned_to && (
        <AssigneeAvatar full_name={normalized.assigned_to.full_name} />
      )}
      <div onClick={(e) => e.stopPropagation()}>
        {onStatusChange ? (
          <StatusSelect
            status={normalized.status}
            taskId={normalized.id}
            onStatusChange={onStatusChange}
          />
        ) : (
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.badge}`}
          >
            {normalized.status}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Empty State ────────────────────────────────────────────────────────────────

const EmptyState = ({ compact }) =>
  compact ? (
    <p className="text-center text-sm text-slate-400 py-6">No tasks yet.</p>
  ) : (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {" "}
      {/* ← tambah items-center */}
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
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <p className="text-slate-400 text-sm font-medium">No tasks yet</p>
      <p className="text-slate-300 text-xs mt-1">
        Click "+ Add Task" to get started
      </p>
    </div>
  );

// ── Default new task template ──────────────────────────────────────────────────

const createEmptyTask = () => ({
  id: null,
  title: "",
  description: "",
  status: "todo",
  due_date: null,
  assigned_to: null,
});

// ── Main Component ─────────────────────────────────────────────────────────────
//
// Props:
//   tasks          : array task (required)
//   title          : string (default: "Tasks")
//   showFilter     : boolean (default: true)
//   maxItems       : number
//   onStatusChange : (taskId, newStatus) => void
//   onSaveTask     : (updatedRawTask) => void
//   onCreateTask   : (newTask) => void  ← NEW: called when creating a new task
//   onDeleteTask   : (taskId) => void
//   compact        : boolean (default: false)
//   groups         : array group
//   formatDate     : (dateStr) => string

const TaskList = ({
  tasks = [],
  title = "Tasks",
  showFilter = true,
  maxItems,
  onStatusChange,
  onSaveTask,
  onCreateTask, // ← NEW prop
  onDeleteTask,
  compact = false,
  groups = [],
  members = [],
  formatDate,
}) => {
  const [filter, setFilter] = useState("All");
  const [selectedNormalized, setSelectedNormalized] = useState(null);
  const [editingTask, setEditingTask] = useState(false);
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem(VIEW_KEY) || "card", // "card" | "compact"
  );

  // ── NEW: create mode state ──────────────────────────────────────────────────
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState(createEmptyTask());

  const normalized = tasks.map((t) => normalizeTask(t, groups, formatDate));

  const filtered =
    filter === "All"
      ? normalized
      : normalized.filter((t) => t.status === filter);

  const displayed = maxItems ? filtered.slice(0, maxItems) : filtered;
  const hiddenCount = filtered.length - displayed.length;

  const handleCardClick = (n) => {
    const raw = n._raw;
    const normalizedRaw = {
      ...raw,
      assigned_to_id: raw.assigned_to_id ?? raw.assigned_to?.id ?? null,
    };
    setSelectedNormalized({ ...n, _raw: normalizedRaw });
    setEditingTask(false);
  };

  const handleClose = () => {
    setSelectedNormalized(null);
    setEditingTask(false);
  };

  // ── Open create modal ───────────────────────────────────────────────────────
  const handleAddTaskClick = () => {
    setNewTask(createEmptyTask());
    setIsCreating(true);
  };

  const handleCreateClose = () => {
    setIsCreating(false);
    setNewTask(createEmptyTask());
  };

  // onSave handler passed to TaskModal in create mode
  // TaskModal calls onSave() with no args — raw task is in newTask state
  const handleCreateSave = async () => {
    await onCreateTask?.(newTask);
    handleCreateClose();
  };

  const toggleView = () => {
    const next = viewMode === "card" ? "compact" : "card";
    setViewMode(next);
    localStorage.setItem(VIEW_KEY, next);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-6 pb-4">
          <h2 className="text-lg font-semibold text-slate-900 flex-shrink-0">
            {title}
          </h2>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter — select untuk compact/mobile, buttons untuk card/desktop */}
            {showFilter && (
              <>
                {/* Compact mode atau layar kecil — pakai select */}
                <div
                  className={
                    viewMode !== "compact" ? "hidden sm:flex gap-2" : "hidden"
                  }
                >
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-[7px] rounded-lg text-sm font-medium transition-all duration-200 ${
                        filter === f
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Select — tampil di mobile (card mode) dan semua ukuran di compact mode */}
                <div
                  className={viewMode !== "compact" ? "flex sm:hidden" : "flex"}
                >
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-[7px] text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    {FILTERS.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Add Task */}
            {onCreateTask && (
              <button
                onClick={handleAddTaskClick}
                className="px-3 py-[7px] bg-indigo-600 text-white text-sm rounded-lg font-semibold hover:bg-indigo-700 transition flex-shrink-0"
              >
                + Add Task
              </button>
            )}

            {/* Toggle View */}
            <button
              onClick={toggleView}
              className="p-[7px] rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition flex-shrink-0"
              title={
                viewMode === "card"
                  ? "Switch to compact view"
                  : "Switch to card view"
              }
            >
              {viewMode === "card" ? (
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
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              ) : (
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
                    d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Task list */}
        <div
          className={`flex-1 flex flex-col px-6 pb-6 ${viewMode === "compact" ? "mt-0" : "gap-4 mt-4"}`}
          // className={`flex-1 flex flex-col px-6 pb-6 ${viewMode === "compact" ? "" : "gap-4 mt-6"}`}
        >
          {displayed.length === 0 ? (
            <EmptyState compact={viewMode === "compact"} />
          ) : viewMode === "compact" ? (
            <div>
              {displayed.map((n) => (
                <TaskRow
                  key={n.id}
                  normalized={n}
                  onTaskClick={handleCardClick}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          ) : (
            displayed.map((n) => (
              <TaskCard
                key={n.id}
                normalized={n}
                onTaskClick={handleCardClick}
                onStatusChange={onStatusChange}
              />
            ))
          )}

          {/* ← tambahkan kembali hiddenCount */}
          {hiddenCount > 0 && (
            <p className="text-center text-xs text-slate-400 mt-2">
              +{hiddenCount} more tasks
            </p>
          )}
        </div>
      </div>

      {/* TaskModal — view/edit existing task */}
      {selectedNormalized && (
        <TaskModal
          task={selectedNormalized._raw}
          members={members}
          editing={editingTask}
          setEditing={setEditingTask}
          setTask={(updatedRaw) =>
            setSelectedNormalized((prev) => ({ ...prev, _raw: updatedRaw }))
          }
          onClose={handleClose}
          onSave={async () => {
            await onSaveTask?.(selectedNormalized._raw);
            setEditingTask(false);
            handleClose();
          }}
          onDelete={async () => {
            await onDeleteTask?.(selectedNormalized._raw.id);
            handleClose();
          }}
        />
      )}

      {/* TaskModal — create new task */}
      {isCreating && (
        <TaskModal
          task={newTask}
          members={members}
          editing={true} // langsung mode edit saat create
          setEditing={(val) => {
            // kalau user cancel edit saat create, tutup modal
            if (!val) handleCreateClose();
          }}
          setTask={setNewTask} // update newTask state langsung
          onClose={handleCreateClose}
          onSave={handleCreateSave}
          onDelete={null} // tidak ada delete saat create
          isCreating={true} // opsional: bisa dipakai TaskModal untuk ubah label
        />
      )}
    </>
  );
};

export default TaskList;
