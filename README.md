# Todo App — Frontend (Simple)

A lightweight, responsive React frontend for a Todo/Task Manager. Connects to the backend API to manage users, tasks and groups.

## ✨ Key features

- Authentication (signup / signin with JWT)
- Dashboard with task overview and quick status updates
- Create / edit / delete tasks, set due dates
- Group collaboration (join by invite)
- Responsive UI and protected routes

## 🚀 Quick start

Prerequisites: Node.js 14+ and npm

1. Install dependencies

```bash
npm install
```

2. Create `.env` in project root with API URL

```env
VITE_API_URL=http://localhost:8000/api
```

3. Run locally

```bash
npm start
```

## 🧭 How to use (short)

- Sign up or sign in
- Click `Add Task` to create a new task
- Use the task status dropdown to move tasks between To Do / In Progress / Done
- Join a group via `Join Group` using the invite code/link


## 🗂️ Project structure (brief)

- `src/components` — UI components
- `src/pages` — page views (Auth, Dashboard, Tasks, Profile, Group)
- `src/context` — React contexts (Auth, Notification)
- `src/services/api.js` — Axios / API configuration

## ⚙️ Scripts

- `npm start` — Vite dev server (http://localhost:5173)
- `npm run build` — build for production (`dist` folder)
- `npm run preview` — preview production build (`vite preview`)

## ⚠️ Notes

- Do not commit your `.env` file
- Ensure backend supports the endpoints above and CORS

## 📝 Contributing & License

Contributions welcome — open an issue or PR. Licensed under MIT.

