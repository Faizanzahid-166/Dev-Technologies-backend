import { io } from "socket.io-client";
import realtimeEnv from "./realtimeEnv.js";

let socket;

export const connectSocket = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  socket = io(realtimeEnv.backendUrlsocket || "http://localhost:3000", {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
  socket.on("connect_error", (err) =>
    console.error("❌ Socket connect_error:", err.message)
  );

  return socket;
};

export const getSocket = () => socket;
