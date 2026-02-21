// GroupDetail.jsx
import { useState } from "react";
import "./GroupDetail.css";

// ── Dummy Data ──────────────────────────────────────────
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
    color: "",
  },
  {
    id: 2,
    initials: "RD",
    name: "Rendra D",
    role: "rendra@gmail.com",
    isAdmin: false,
    color: "green",
  },
  {
    id: 3,
    initials: "MA",
    name: "Maya A",
    role: "maya@gmail.com",
    isAdmin: false,
    color: "orange",
  },
  {
    id: 4,
    initials: "SL",
    name: "Sela L",
    role: "sela@gmail.com",
    isAdmin: false,
    color: "pink",
  },
];

const TASKS = [
  {
    id: 1,
    name: "task 1 uuu",
    desc: "desc update",
    status: "In Progress",
    due: null,
    assignee: { initials: "AG", color: "" },
  },
  {
    id: 2,
    name: "task 3 Update",
    desc: "desc u again",
    status: "In Progress",
    due: "26 Feb 2026, 07.00",
    assignee: { initials: "RD", color: "green" },
  },
  {
    id: 3,
    name: "task baru terakhir niiii....",
    desc: "last",
    status: "Done",
    due: "28 Feb 2026, 19.00",
    assignee: { initials: "MA", color: "orange" },
  },
  {
    id: 4,
    name: "Setup CI/CD pipeline",
    desc: "configure github actions",
    status: "To Do",
    due: "05 Mar 2026, 10.00",
    assignee: { initials: "SL", color: "pink" },
  },
];
// ────────────────────────────────────────────────────────

function statusBadgeClass(status) {
  if (status === "In Progress") return "badge badge-inprogress";
  if (status === "Done") return "badge badge-done";
  return "badge badge-todo";
}

function statusIcon(status) {
  if (status === "In Progress") return "⏳";
  if (status === "Done") return "✅";
  return "📋";
}

export default function GroupDetail() {
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
    <div className="group-detail">
      {/* ── Page Content ── */}
      <div className="page-wrapper">
        {/* Back */}
        <button className="back-btn" onClick={() => window.history.back()}>
          ← Back to Dashboard
        </button>

        {/* ── Group Header ── */}
        <div className="group-header-card">
          <div className="group-header-left">
            <div className="group-icon-circle">👥</div>
            <div>
              <div className="group-title">{GROUP.name}</div>
              <div className="group-meta">
                Created {GROUP.createdAt} &nbsp;·&nbsp; {members.length} members
              </div>
              <div className="group-meta" style={{ marginTop: 2 }}>
                {GROUP.description}
              </div>
            </div>
          </div>
          <div className="group-header-actions">
            <button className="btn-primary">+ Add Task</button>
            <button className="btn-outline">✉ Invite Member</button>
            <button className="btn-danger-outline">Leave Group</button>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="stats-row">
          <div className="stat-card purple">
            <div className="stat-icon">📋</div>
            <div className="stat-number">{totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">⏱</div>
            <div className="stat-number">{todoCnt}</div>
            <div className="stat-label">To Do</div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon">🔄</div>
            <div className="stat-number">{inProgressCnt}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-number">{doneCnt}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="main-grid">
          {/* Left: Tasks */}
          <div className="section-card">
            <div className="section-header">
              <div className="section-title">Group Tasks</div>
              <div className="filter-pills">
                {["All", "To Do", "In Progress", "Done"].map((f) => (
                  <button
                    key={f}
                    className={`pill ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="task-list">
              {filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <p>No tasks found for this filter.</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div className="task-item" key={task.id}>
                    <div className="task-item-left">
                      <div className="task-name">{task.name}</div>
                      <div className="task-desc">{task.desc}</div>
                      <div className="task-item-meta">
                        <div className="task-assignee">
                          <div className={`avatar-xs ${task.assignee.color}`}>
                            {task.assignee.initials}
                          </div>
                          {task.assignee.initials}
                        </div>
                        {task.due && (
                          <div className="task-due">📅 {task.due}</div>
                        )}
                      </div>
                    </div>
                    <div className="task-item-right">
                      <span className={statusBadgeClass(task.status)}>
                        {statusIcon(task.status)} {task.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Members */}
          <div className="section-card">
            <div className="section-header">
              <div className="section-title">Members ({members.length})</div>
            </div>

            <div className="members-list">
              {members.map((m) => (
                <div className="member-item" key={m.id}>
                  <div className="member-left">
                    <div className={`avatar-sm ${m.color}`}>{m.initials}</div>
                    <div>
                      <div className="member-name">{m.name}</div>
                      <div className="member-role">{m.role}</div>
                    </div>
                  </div>
                  {m.isAdmin && <span className="badge-admin">Admin</span>}
                </div>
              ))}
            </div>

            <button className="invite-btn">+ Invite Member</button>
          </div>
        </div>
      </div>
    </div>
  );
}
