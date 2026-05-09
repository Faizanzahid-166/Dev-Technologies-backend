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

// // Attach JWT token to every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Global response error handling
// api.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => Client.post('/api/auth/signup', data),
  login: (data) => Client.post('/api/auth/login', data),
  getMe: () => Client.get('/api/auth/me'),
  logout: () => Client.post('/api/auth/logout'),
};

// ─── User / Profile ───────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => Client.get('/api/user/profile'),
  updateProfile: (data) => Client.put('/api/user/profile', data),
  getStats: () => Client.get('/api/user/stats'),
};

// ─── Dependencies ─────────────────────────────────────────────────────────────
export const dependenciesAPI = {
  getAll: (params) => Client.get('/api/dependencies', { params }),
  getOne: (id) => Client.get(`/api/dependencies/${id}`),
  create: (data) => Client.post('/api/dependencies', data),
  update: (id, data) => Client.put(`/api/dependencies/${id}`, data),
  delete: (id) => Client.delete(`/api/dependencies/${id}`),
};

//export default api;