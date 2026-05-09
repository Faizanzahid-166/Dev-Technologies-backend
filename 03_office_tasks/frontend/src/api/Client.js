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

Client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    // If 401, clear user state (handled by AuthContext)
    if (error.response?.status === 401) {
      // Dispatch custom event to signal auth failure
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    return Promise.reject({ ...error, message });
  }
);

export default Client;
