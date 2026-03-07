import { useRef, useEffect, useState } from "react";
import { FILTERS, AVATAR_COLORS, getInitials } from "./taskUtils";

const TaskListHeader = ({
  title,
  search,
  onSearchChange,
  filter,
  onFilterChange,
  showFilter,
  members,
  assigneeFilter,
  onAssigneeToggle,
  onAssigneeClear,
  viewMode,
  onToggleView,
  onAddTask,
}) => {
  const filterDropdownRef = useRef(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(e.target)
      ) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="px-6 pt-5 pb-0">
      {/* Row 1: Title + Add Task + Toggle */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <div className="flex items-center gap-2 flex-shrink-0">
          {onAddTask && (
            <button
              onClick={onAddTask}
              className="px-3 py-[7px] bg-indigo-600 text-white text-sm rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-1.5"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Task
            </button>
          )}
          <button
            onClick={onToggleView}
            title={
              viewMode === "card"
                ? "Switch to compact view"
                : "Switch to card view"
            }
            className="p-[7px] rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition"
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

      {/* Row 2: Toolbar */}
      <div className="flex items-center gap-2 border-t border-slate-100 py-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-8 pr-8 py-[7px] text-xs border-0 bg-transparent text-slate-700
              placeholder:text-slate-400 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 flex-shrink-0" />

        {/* Assignee filter */}
        {members.length > 0 && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Unassigned */}
            <button
              onClick={() => onAssigneeToggle("unassigned")}
              title="Unassigned"
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                ${
                  assigneeFilter.includes("unassigned")
                    ? "border-indigo-500 bg-indigo-100"
                    : "border-dashed border-slate-300 bg-white hover:border-slate-400"
                }`}
            >
              <svg
                className={`w-3 h-3 ${assigneeFilter.includes("unassigned") ? "text-indigo-500" : "text-slate-400"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {/* Member avatars */}
            <div className="flex -space-x-1.5">
              {members.filter(Boolean).map((m) => {
                const isActive = assigneeFilter.includes(m.id);
                const noneSelected = assigneeFilter.length === 0;
                const colorIndex = [...(m.full_name || "")].reduce(
                  (acc, c) => acc + c.charCodeAt(0),
                  0,
                );
                const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
                return (
                  <button
                    key={m.id}
                    onClick={() => onAssigneeToggle(m.id)}
                    title={m.full_name}
                    className={`w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center
                      border-2 border-white transition-all relative flex-shrink-0 ${color}
                      ${noneSelected || isActive ? "opacity-100" : "opacity-30"}
                      ${isActive ? "ring-2 ring-indigo-400 ring-offset-1 z-10" : "hover:opacity-80 hover:z-10"}`}
                  >
                    {getInitials(m.full_name || "")}
                  </button>
                );
              })}
            </div>

            {assigneeFilter.length > 0 && (
              <button
                onClick={onAssigneeClear}
                className="text-[10px] text-slate-400 hover:text-indigo-600 px-1 py-0.5 rounded transition"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Divider */}
        {members.length > 0 && showFilter && (
          <div className="w-px h-5 bg-slate-200 flex-shrink-0" />
        )}

        {/* Status dropdown */}
        {showFilter && (
          <div className="relative flex-shrink-0" ref={filterDropdownRef}>
            <button
              onClick={() => setShowFilterDropdown((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-[7px] rounded-lg text-xs font-medium transition-all
                ${filter !== "All" ? "bg-indigo-50 text-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
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
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                />
              </svg>
              <span className="hidden sm:inline">
                {filter === "All" ? "Status" : filter}
              </span>
              <svg
                className={`w-3 h-3 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showFilterDropdown && (
              <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      onFilterChange(f);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium transition-all flex items-center gap-2
                      ${filter === f ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {filter === f ? (
                      <svg
                        className="w-3 h-3 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="w-3 flex-shrink-0" />
                    )}
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskListHeader;
