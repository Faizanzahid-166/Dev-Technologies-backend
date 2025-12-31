// src/api/axiosConfig.js
import axios from "axios";
import realtimEnv from "./realtimeEnv.js";

const api = axios.create({
  baseURL: realtimEnv.backendUrl || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ cookie auth
});

export default api;
