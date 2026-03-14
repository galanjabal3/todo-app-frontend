// ── Status constants ───────────────────────────────────────────────────────────

export const NORMALIZE_STATUS = {
  todo: "To Do",
  "in progress": "In Progress",
  done: "Done",
  "To Do": "To Do",
  "In Progress": "In Progress",
  Done: "Done",
};

export const DENORMALIZE_STATUS = {
  "To Do": "todo",
  "In Progress": "in progress",
  Done: "done",
};

export const STATUS_CONFIG = {
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

export const FILTERS = ["All", "To Do", "In Progress", "Done"];

export const VIEW_KEY = "tasklist_view";

// ── Avatar helpers ─────────────────────────────────────────────────────────────

export const AVATAR_COLORS = [
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

export const getAvatarColor = (name = "") => {
  const index = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
};

export const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

// ── Task normalizer ────────────────────────────────────────────────────────────

export const normalizeTask = (task, groups = [], formatDate) => {
  const isDashboard = "title" in task;
  const status = NORMALIZE_STATUS[task.status] || "To Do";

  const due = task.due_date
    ? formatDate
      ? formatDate(task.due_date)
      : task.due_date
    : null;

  let groupLabel = null;
  if (isDashboard && task.group_id) {
    const g = groups.find((g) => g.id === task.group_id);
    groupLabel = g?.name || "Group";
  }

  const isOverdue =
    task.due_date &&
    NORMALIZE_STATUS[task.status] !== "Done" &&
    new Date(task.due_date) < new Date();

  return {
    _raw: task,
    _isDashboard: isDashboard,
    id: task.id,
    name: isDashboard ? task.title : task.name,
    desc: isDashboard ? task.description : task.desc,
    status,
    due,
    isOverdue,
    groupLabel,
    assigned_to: task.assigned_to || null,
    priority: task.priority || null,
  };
};

// ── Empty task template ────────────────────────────────────────────────────────

export const createEmptyTask = () => ({
  id: null,
  title: "",
  description: "",
  status: "todo",
  due_date: null,
  assigned_to: null,
  priority: null,
});

// ── Priority constants ─────────────────────────────────────────────────────────

export const PRIORITY_CONFIG = {
  low: {
    label: "Low",
    icon: "🟢",
    badge:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  },
  medium: {
    label: "Medium",
    icon: "🟡",
    badge:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  },
  high: {
    label: "High",
    icon: "🔴",
    badge: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  },
};

export const PRIORITY_FILTERS = ["All", "Low", "Medium", "High"];
