import { io } from "socket.io-client";
import Client from "../config/Client.js";

const socket = io(Client.backendUrl || "http://localhost:3000", {
  withCredentials: true, // ✅ VERY IMPORTANT (cookie auth)
  autoConnect: false,    // we will connect manually
});

// Listen for successful connection
socket.on("connect", () => {
  console.log(`✅ Socket connected with id: ${socket.id}`);
});

// Listen for disconnection
socket.on("disconnect", (reason) => {
  console.log(`❌ Socket disconnected: ${reason}`);
});

// Listen for reconnection attempts (optional)
socket.io.on("reconnect_attempt", (attempt) => {
  console.log(`🔄 Socket trying to reconnect, attempt: ${attempt}`);
});

// Optional: log connection state whenever needed
export const logSocketStatus = () => {
  console.log(`Socket connected? ${socket.connected}`);
};

export default socket;
