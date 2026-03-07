const TaskEmptyState = ({ compact, isSearching }) => {
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p className="text-slate-400 text-sm font-medium">No results found</p>
        <p className="text-slate-300 text-xs mt-1">Try a different keyword</p>
      </div>
    );
  }

  if (compact) {
    return (
      <p className="text-center text-sm text-slate-400 py-6">No tasks yet.</p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
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
};

export default TaskEmptyState;
