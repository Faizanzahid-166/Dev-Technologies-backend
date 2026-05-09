// src/api/contactApi.js
import Client from "./Client.js";

export const checkHealth = async (data) => {
    const res = await Client.get("/api/health", data);
    return res.data;
    // 👉 DevTools → Network tab → Refresh page
    // What to check:
    // ✅ Status = 200 → backend connected
    // ❌ 404 → wrong route
    // ❌ 500 → backend error
    // ❌ CORS error → config issue

};

// Auth API
export const authAPI = {
  register: (data) => Client.post('/api/auth/register', data),
  login: (data) => Client.post('/api/auth/login', data),
  logout: () => Client.post('/api/auth/logout'),
  me: () => Client.get('/api/auth/me'),
};

// Tasks API
export const tasksAPI = {
  create: (data) => Client.post('/api/tasks', data),
  getAll: (params) => Client.get('/api/tasks', { params }),
  getMy: (params) => Client.get('/api/tasks/my', { params }),
  updateStatus: (id, data) => Client.patch(`/api/tasks/${id}/status`, data),
  getReasons: () => Client.get('/api/tasks/reasons'),
};

// Users API
export const usersAPI = {
  getEmployees: () => Client.get('/api/users/employees'),
};

