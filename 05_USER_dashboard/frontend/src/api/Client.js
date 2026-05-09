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

export default Client;
