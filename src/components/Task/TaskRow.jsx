import { STATUS_CONFIG } from "./taskUtils";
import { AssigneeAvatar, StatusSelect, StatusBadge } from "./TaskCard";

const TaskRow = ({ normalized, onTaskClick, onStatusChange }) => {
  const cfg = STATUS_CONFIG[normalized.status] || STATUS_CONFIG["To Do"];

  return (
    <div
      onClick={() => onTaskClick?.(normalized)}
      className={`flex items-center gap-3 py-3 border-b border-light last:border-0
        ${onTaskClick ? "cursor-pointer hover:bg-hover -mx-2 px-2 rounded-lg transition" : ""}
        ${normalized.isOverdue ? "bg-red-50/30 dark:bg-red-900/10" : ""}`}
    >
      <div
        className={`w-2 h-2 rounded-full flex-shrink-0 ${
          normalized.isOverdue ? "bg-red-400" : cfg.dot
        }`}
      />

      <span
        className={`flex-1 text-sm font-medium truncate ${
          normalized.isOverdue ? "text-red-600 dark:text-red-400" : "text-app"
        }`}
      >
        {normalized.name}
      </span>

      {normalized.isOverdue && (
        <span className="text-xs text-red-400 dark:text-red-500 font-medium flex-shrink-0">
          Overdue
        </span>
      )}

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
          <StatusBadge status={normalized.status} />
        )}
      </div>
    </div>
  );
};

export default TaskRow;
