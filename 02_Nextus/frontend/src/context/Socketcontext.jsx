// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./Authcontext.jsx";
import realtimeEnv from '../api/realtimeEnv.js'

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null); // keep single socket instance

  useEffect(() => {
    if (!user) return; // only connect if logged in

    const token = localStorage.getItem("token");
    if (!token) return;

    // Prevent duplicate socket connections
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const s = io(realtimeEnv.backendUrlsocket || "http://localhost:3000", {
      auth: { token },
      transports: ["websocket"],
    });

    s.on("connect", () => console.log("✅ Socket connected:", s.id));
    s.on("connect_error", (err) => console.error("❌ Socket error:", err.message));
    s.on("disconnect", (reason) => console.log("⚡ Socket disconnected:", reason));

    socketRef.current = s;
    setSocket(s);

    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [user]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
