import { io } from "socket.io-client";
import realtimEnv from "../config/realtimeEnv.js";

const socket = io(realtimEnv.backendUrl || "http://localhost:3000", {
  withCredentials: true, // ✅ VERY IMPORTANT (cookie auth)
  autoConnect: false,    // we will connect manually
});

export default socket;
