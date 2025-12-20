// src/api/axiosConfig.js
import axios from "axios";
import realtimEnv from './realtimeEnv.js'

const api = axios.create({
  baseURL: realtimEnv.backendUrllocal || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
