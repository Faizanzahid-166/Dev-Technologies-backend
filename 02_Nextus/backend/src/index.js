// index.js
// src/index.js
import "./config/dotenv.js"; // load .env first

import http from "http";
import { Server } from "socket.io";
import { server } from "./server.js";
import connectDB from "./database/mongodb/db.js";

const PORT = process.env.PORT || 5000;

/* =======================
   CREATE HTTP SERVER (ONCE)
======================= */
const httpServer = http.createServer(server);

/* =======================
   SOCKET.IO
======================= */
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://dev-technologies-frontend-9xqc.vercel.app",
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("send-message", (data) => {
    io.emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

/* =======================
   START SERVER
======================= */
const startServer = async () => {
  try {
    await connectDB(); // ✅ DB FIRST

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
