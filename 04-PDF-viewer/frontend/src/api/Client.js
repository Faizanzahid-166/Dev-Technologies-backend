// src/api/apiClient.js
import axios from "axios";
import ENV from "./ENV.js";

const Client = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? ENV.nodeURL
      : ENV.backendURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔥 THIS IS THE KEY
});

// Response interceptor for consistent error handling
Client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong.";
    return Promise.reject(new Error(message));
  }
);

export default Client; 
