import { useState, useEffect } from "react";
import TaskModal from "./TaskModal";
import TaskCard from "./TaskCard";
import TaskRow from "./TaskRow";
import TaskEmptyState from "./TaskEmptyState";
import TaskListHeader from "./TaskListHeader";
import { normalizeTask, createEmptyTask, VIEW_KEY } from "./taskUtils";

const TaskList = ({
  tasks = [],
  title = "Tasks",
  showFilter = true,
  maxItems,
  onStatusChange,
  onSaveTask,
  onCreateTask,
  onDeleteTask,
  groups = [],
  members = [],
  formatDate,
}) => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState([]);
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem(VIEW_KEY) || "card",
  );
  const [selectedNormalized, setSelectedNormalized] = useState(null);
  const [editingTask, setEditingTask] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState(createEmptyTask());

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 1000);
    return () => clearTimeout(timer);
  }, [search]);

  const normalized = tasks.map((t) => normalizeTask(t, groups, formatDate));

  const filtered = normalized
    .filter((t) => filter === "All" || t.status === filter)
    .filter((t) => {
      if (assigneeFilter.length === 0) return true;
      if (assigneeFilter.includes("unassigned") && !t.assigned_to) return true;
      return assigneeFilter.includes(t.assigned_to?.id);
    })
    .filter((t) =>
      debouncedSearch.trim() === ""
        ? true
        : t.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          t.desc?.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );

  const displayed = maxItems ? filtered.slice(0, maxItems) : filtered;
  const hiddenCount = filtered.length - displayed.length;

  const handleCardClick = (n) => {
    const raw = n._raw;
    setSelectedNormalized({
      ...n,
      _raw: {
        ...raw,
        assigned_to_id: raw.assigned_to_id ?? raw.assigned_to?.id ?? null,
      },
    });
    setEditingTask(false);
  };

  const handleClose = () => {
    setSelectedNormalized(null);
    setEditingTask(false);
  };

  const handleAddTaskClick = () => {
    setNewTask(createEmptyTask());
    setIsCreating(true);
  };

  const handleCreateClose = () => {
    setIsCreating(false);
    setNewTask(createEmptyTask());
  };

  const toggleView = () => {
    const next = viewMode === "card" ? "compact" : "card";
    setViewMode(next);
    localStorage.setItem(VIEW_KEY, next);
  };

  const toggleAssignee = (id) => {
    setAssigneeFilter((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col overflow-hidden">
        <TaskListHeader
          title={title}
          search={search}
          onSearchChange={setSearch}
          filter={filter}
          onFilterChange={setFilter}
          showFilter={showFilter}
          members={members}
          assigneeFilter={assigneeFilter}
          onAssigneeToggle={toggleAssignee}
          onAssigneeClear={() => setAssigneeFilter([])}
          viewMode={viewMode}
          onToggleView={toggleView}
          onAddTask={onCreateTask ? handleAddTaskClick : null}
        />

        {/* Task list */}
        <div
          className={`flex-1 flex flex-col px-6 pb-6 ${viewMode === "compact" ? "mt-0" : "gap-4 mt-2"}`}
        >
          {displayed.length === 0 ? (
            <TaskEmptyState
              compact={viewMode === "compact"}
              isSearching={debouncedSearch.trim() !== ""}
            />
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
          editing={true}
          setEditing={(val) => {
            if (!val) handleCreateClose();
          }}
          setTask={setNewTask}
          onClose={handleCreateClose}
          onSave={async () => {
            await onCreateTask?.(newTask);
            handleCreateClose();
          }}
          onDelete={null}
          isCreating={true}
        />
      )}
    </>
  );
};

export default TaskList;
