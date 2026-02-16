import axios from "axios";

// Vite uses import.meta.env for env variables (VITE_ prefix).
const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor untuk handle response & error
api.interceptors.response.use(
  (response) => {
    const res = response.data;
    // console.log('res', res);

    if (res?.data !== undefined) {
      return res.data;
    }

    return res;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/signin";
    }

    return Promise.reject(error.response?.data || error);
  },
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post("/auth/register", data),
  signin: (data) => api.post("/auth/login", data),
};

export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user/profile", data),
};

// Task APIs
export const taskAPI = {
  getTasks: (params) => api.get("/user/tasks", { params }),
  getTask: (id) => api.get(`/user/tasks/${id}`),
  createTask: (data) => api.post("/user/tasks", data),
  updateTask: (id, data) => api.put(`/user/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/user/tasks/${id}`),
  updateStatus: (id, status) => api.patch(`/user/tasks/${id}`, { status }),
};

// Group APIs
export const groupAPI = {
  getMyGroups: () => api.get("/user/my_groups"),
  getGroups: () => api.get("/user/groups"),
  getGroup: (id) => api.get(`/user/groups/${id}`),
  createGroup: (data) => api.post("/user/groups", data),
  updateGroup: (id, data) => api.put(`/user/groups/${id}`, data),
  deleteGroup: (id) => api.delete(`/user/groups/${id}`),
  joinGroup: (code) => api.post("/groups/join", { code }),
  getMembers: (groupId) => api.get(`/groups/${groupId}/members`),
  getInviteCode: (groupId) => api.get(`/groups/${groupId}/invite-code`),
};

export default api;
