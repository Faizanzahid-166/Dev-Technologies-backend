// src/api/apiClient.js
import axios from "axios";
import ENV from "./ENV.js";

const Client = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? ENV.nodeURL
      : ENV.backendURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔥 THIS IS THE KEY
});

// Attach JWT token
Client.interceptors.request.use((config) => {
  const token = localStorage.getItem('blogToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
 
// Handle 401 globally
Client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('blogToken');
      localStorage.removeItem('blogUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default Client;
