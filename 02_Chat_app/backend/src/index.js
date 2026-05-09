// index.js
import "./config/dotenv.js"; // load .env first
import http from "http";
import { Server } from "socket.io";
import { server as app } from "./server.js";
import connectDB from "./database/mongodb/db.js";

const PORT = process.env.PORT || 5000;

// 1️⃣ Create HTTP server from Express app
const httpServer = http.createServer(app);

// 2️⃣ Attach Socket.IO to SAME server
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173", "https://dev-technologies-frontend-9xqc.vercel.app",
    ],
    credentials: true,
  },
});

// 3️⃣ Socket.IO logic
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("userOnline", (userId) => {
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, []);
    onlineUsers.get(userId).push(socket.id);

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);

    for (let [userId, sockets] of onlineUsers) {
      const filtered = sockets.filter(id => id !== socket.id);
      if (filtered.length > 0) onlineUsers.set(userId, filtered);
      else onlineUsers.delete(userId);
    }

    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
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