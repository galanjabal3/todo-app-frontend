const TaskOverview = ({ tasks }) => {
  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  const stats = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      value: taskStats.total,
      label: "Total Tasks",
      border: "border-indigo-400",
      iconBg: "bg-indigo-50 text-indigo-500",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 10h16M4 14h10"
          />
        </svg>
      ),
      value: taskStats.todo,
      label: "To Do",
      border: "border-slate-400",
      iconBg: "bg-slate-50 text-slate-500",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      value: taskStats.inProgress,
      label: "In Progress",
      border: "border-amber-400",
      iconBg: "bg-amber-50 text-amber-500",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      value: taskStats.done,
      label: "Completed",
      border: "border-emerald-400",
      iconBg: "bg-emerald-50 text-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`bg-white px-6 py-7 rounded-xl shadow-sm border-t-4 ${s.border} flex flex-col items-center`}
        >
          <div
            className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center mb-3`}
          >
            {s.icon}
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight">
            {s.value}
          </div>
          <div className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wide">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskOverview;
