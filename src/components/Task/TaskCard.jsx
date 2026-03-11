import { DENORMALIZE_STATUS, STATUS_CONFIG } from "./taskUtils";
import { getAvatarColor, getInitials } from "./taskUtils";

export const AssigneeAvatar = ({ full_name, size = "sm" }) => {
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

export const StatusSelect = ({ status, taskId, onStatusChange }) => {
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

export const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["To Do"];
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${cfg.badge}`}
    >
      {cfg.icon} {status}
    </span>
  );
};

const TaskCard = ({ normalized, onTaskClick, onStatusChange }) => (
  <div
    onClick={() => onTaskClick?.(normalized)}
    className={`bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200
      ${normalized.isOverdue ? "border-red-200 dark:border-red-800 hover:border-red-300" : "border-app hover:border-indigo-300 dark:hover:border-indigo-700"}
      ${onTaskClick ? "cursor-pointer" : ""}`}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-app truncate">{normalized.name}</h3>
        {normalized.desc && (
          <p className="text-sm text-soft mt-0.5 truncate">{normalized.desc}</p>
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

    {(normalized.assigned_to || normalized.due) && (
      <div className="flex items-center gap-2 mt-3">
        {normalized.assigned_to && (
          <AssigneeAvatar full_name={normalized.assigned_to.full_name} />
        )}
        {normalized.assigned_to && normalized.due && (
          <span className="text-muted-app text-xs">·</span>
        )}
        {normalized.due && (
          <span
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 text-xs whitespace-nowrap
            ${
              normalized.isOverdue
                ? "bg-red-50 dark:bg-red-900/20 text-red-500"
                : "bg-subtle text-soft"
            }`}
          >
            <svg
              className={`w-3 h-3 flex-shrink-0 ${normalized.isOverdue ? "text-red-400" : "text-muted-app"}`}
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
            {normalized.isOverdue && (
              <span className="font-semibold">· Overdue</span>
            )}
          </span>
        )}
      </div>
    )}
  </div>
);

export default TaskCard;
