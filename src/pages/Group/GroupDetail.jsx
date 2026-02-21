import { useState } from "react";

const GROUP = {
  id: 1,
  name: "GK 1 U",
  createdAt: "Jan 2026",
  description: "Frontend team for Project GK",
};

const MEMBERS = [
  {
    id: 1,
    initials: "AG",
    name: "Account G",
    role: "admin@gmail.com",
    isAdmin: true,
    color: "bg-indigo-600",
  },
  {
    id: 2,
    initials: "RD",
    name: "Rendra D",
    role: "rendra@gmail.com",
    isAdmin: false,
    color: "bg-emerald-500",
  },
  {
    id: 3,
    initials: "MA",
    name: "Maya A",
    role: "maya@gmail.com",
    isAdmin: false,
    color: "bg-orange-400",
  },
  {
    id: 4,
    initials: "SL",
    name: "Sela L",
    role: "sela@gmail.com",
    isAdmin: false,
    color: "bg-pink-500",
  },
];

const TASKS = [
  {
    id: 1,
    name: "task 1 uuu",
    desc: "desc update",
    status: "In Progress",
    due: null,
    assignee: { initials: "AG", color: "bg-indigo-600" },
  },
  {
    id: 2,
    name: "task 3 Update",
    desc: "desc u again",
    status: "In Progress",
    due: "26 Feb 2026, 07.00",
    assignee: { initials: "RD", color: "bg-emerald-500" },
  },
  {
    id: 3,
    name: "task baru terakhir niiii....",
    desc: "last",
    status: "Done",
    due: "28 Feb 2026, 19.00",
    assignee: { initials: "MA", color: "bg-orange-400" },
  },
  {
    id: 4,
    name: "Setup CI/CD pipeline",
    desc: "configure github actions",
    status: "To Do",
    due: "05 Mar 2026, 10.00",
    assignee: { initials: "SL", color: "bg-pink-500" },
  },
];

// Status badge classes
const getStatusBadge = (status) => {
  const base =
    "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1";
  if (status === "In Progress") return `${base} bg-amber-50 text-amber-600`;
  if (status === "Done") return `${base} bg-green-50 text-green-700`;
  return `${base} bg-indigo-50 text-indigo-600`;
};

const statusIcon = (status) => {
  if (status === "In Progress") return "⏳";
  if (status === "Done") return "✅";
  return "📋";
};

// Filter pill classes
const pillClass = (active) =>
  `px-[14px] py-[5px] rounded-full text-xs font-semibold cursor-pointer border-none transition-all duration-200 ${
    active
      ? "bg-[#5b4fcf] text-white"
      : "bg-[#f0f2f5] text-gray-600 hover:bg-[#e0ddf8] hover:text-[#5b4fcf]"
  }`;

const GroupDetail = () => {
  const [filter, setFilter] = useState("All");
  const [tasks] = useState(TASKS);
  const [members] = useState(MEMBERS);

  const totalTasks = tasks.length;
  const todoCnt = tasks.filter((t) => t.status === "To Do").length;
  const inProgressCnt = tasks.filter((t) => t.status === "In Progress").length;
  const doneCnt = tasks.filter((t) => t.status === "Done").length;

  const filteredTasks =
    filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <>
      {/* group-detail */}
      <div className="p-10 bg-[#f8fafc] min-h-screen md:p-5">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-[0.88rem] text-[#5b4fcf] font-medium mb-5 bg-transparent border-none cursor-pointer p-0 transition-opacity hover:opacity-75"
        >
          ← Back to Dashboard
        </button>

        {/* ── Group Header Card ── */}
        <div className="bg-white rounded-2xl px-8 py-7 flex items-center justify-between mb-7 shadow-[0_2px_10px_rgba(0,0,0,0.06)] md:flex-col md:items-start md:gap-4">
          <div className="flex items-center gap-[18px]">
            <div className="w-14 h-14 rounded-[14px] bg-[#ede9ff] flex items-center justify-center text-[1.6rem]">
              👥
            </div>
            <div>
              <div className="text-[1.6rem] font-bold text-[#1a1a2e] leading-tight">
                {GROUP.name}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Created {GROUP.createdAt} &nbsp;·&nbsp; {members.length} members
              </div>
              <div className="text-sm text-gray-400 mt-0.5">
                {GROUP.description}
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex gap-2.5 md:w-full md:flex-wrap">
            <button className="px-[18px] py-2 bg-gradient-to-br from-indigo-400 to-indigo-600 text-white rounded-[10px] border-none text-[0.88rem] font-semibold cursor-pointer hover:opacity-90 transition-opacity">
              + Add Task
            </button>
            <button className="px-[18px] py-2 bg-transparent text-[#5b4fcf] border-[1.5px] border-[#5b4fcf] rounded-[10px] text-[0.88rem] font-semibold cursor-pointer transition-all hover:bg-[#ede9ff]">
              ✉ Invite Member
            </button>
            <button className="px-[18px] py-2 bg-transparent text-red-600 border-[1.5px] border-red-500 rounded-[10px] text-[0.88rem] font-semibold cursor-pointer transition-all hover:bg-red-50">
              Leave Group
            </button>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-4 gap-4 mb-7 md:grid-cols-2">
          {[
            {
              icon: "📋",
              value: totalTasks,
              label: "Total Tasks",
              border: "border-t-[#5b4fcf]",
            },
            {
              icon: "⏱",
              value: todoCnt,
              label: "To Do",
              border: "border-t-orange-400",
            },
            {
              icon: "🔄",
              value: inProgressCnt,
              label: "In Progress",
              border: "border-t-yellow-400",
            },
            {
              icon: "✅",
              value: doneCnt,
              label: "Completed",
              border: "border-t-green-500",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`bg-white rounded-[14px] px-6 py-5 flex flex-col items-center shadow-[0_2px_8px_rgba(0,0,0,0.05)] border-t-[3px] ${s.border}`}
            >
              <div className="text-2xl mb-1.5">{s.icon}</div>
              <div className="text-[2rem] font-extrabold text-[#1a1a2e] leading-none">
                {s.value}
              </div>
              <div className="text-[0.78rem] text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-[1fr_320px] gap-6 items-start lg:grid-cols-1">
          {/* ── Tasks Section ── */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-[18px]">
              <div className="text-[1.05rem] font-bold text-[#1a1a2e]">
                Group Tasks
              </div>
              <div className="flex gap-2">
                {["All", "To Do", "In Progress", "Done"].map((f) => (
                  <button
                    key={f}
                    className={pillClass(filter === f)}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Task List */}
            <div className="flex flex-col gap-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-10 text-gray-300">
                  <div className="text-4xl mb-2.5">📭</div>
                  <p className="text-[0.88rem]">
                    No tasks found for this filter.
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border-[1.5px] border-[#f0f0f0] rounded-xl px-[18px] py-4 flex items-start justify-between gap-3 cursor-pointer transition-all duration-200 hover:border-[#d4cef7] hover:shadow-[0_2px_8px_rgba(91,79,207,0.08)]"
                  >
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="text-[0.95rem] font-semibold text-[#1a1a2e]">
                        {task.name}
                      </div>
                      <div className="text-[0.82rem] text-gray-400">
                        {task.desc}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {/* Assignee */}
                        <div className="flex items-center gap-1.5 text-[0.78rem] text-gray-500">
                          <div
                            className={`w-5 h-5 rounded-full ${task.assignee.color} text-white text-[0.6rem] font-bold flex items-center justify-center`}
                          >
                            {task.assignee.initials}
                          </div>
                          {task.assignee.initials}
                        </div>
                        {/* Due date */}
                        {task.due && (
                          <div className="text-[0.78rem] text-gray-400 flex items-center gap-1">
                            📅 {task.due}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={getStatusBadge(task.status)}>
                      {statusIcon(task.status)} {task.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Members Section ── */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-[18px]">
              <div className="text-[1.05rem] font-bold text-[#1a1a2e]">
                Members ({members.length})
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between px-[14px] py-3 rounded-xl border-[1.5px] border-[#f0f0f0] transition-colors hover:border-[#d4cef7]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-[38px] h-[38px] rounded-full ${m.color} text-white text-[0.85rem] font-bold flex items-center justify-center flex-shrink-0`}
                    >
                      {m.initials}
                    </div>
                    <div>
                      <div className="text-[0.9rem] font-semibold text-[#1a1a2e]">
                        {m.name}
                      </div>
                      <div className="text-[0.75rem] text-gray-400 mt-px">
                        {m.role}
                      </div>
                    </div>
                  </div>
                  {m.isAdmin && (
                    <span className="bg-[#ede9ff] text-[#5b4fcf] text-[0.7rem] font-bold px-[9px] py-[3px] rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Invite Button */}
            <button className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-[10px] border-[1.5px] border-dashed border-[#c4b9f5] text-[#5b4fcf] text-[0.85rem] font-semibold bg-transparent cursor-pointer mt-[14px] transition-colors hover:bg-[#ede9ff]">
              + Invite Member
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupDetail;
