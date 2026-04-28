// src/api/axiosConfig.js
import axios from "axios";
import ENV from "./ENV.js";

const Client = axios.create({
  baseURL: ENV.backendUrl || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ cookie auth
});

export default Client;
