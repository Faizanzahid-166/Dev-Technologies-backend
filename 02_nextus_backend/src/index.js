import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { server } from "./server.js";
import { Server } from "socket.io";
import http from "http";
import { verifySocketJWT } from "./middlewares/auth.middleware.js";
import registerSignalingHandlers from "./socket/signaling.js";
import { registerChatHandlers } from "./socket/chat.js";

dotenv.config({ path: "./.env" });

const onlineUsers = new Map(); // userId -> socketId

connectDB()
  .then(() => {
    const httpServer = http.createServer(server);

    const io = new Server(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN,// || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.use(verifySocketJWT);

    io.on("connection", (socket) => {
      if (!socket.user) {
        console.log("❌ Socket user missing, disconnecting");
        return socket.disconnect(true);
      }

      const userId = socket.user.id;

      // Prevent duplicate connections
      if (onlineUsers.has(userId)) {
        const oldSocketId = onlineUsers.get(userId);
        io.sockets.sockets.get(oldSocketId)?.disconnect(true);
      }

      onlineUsers.set(userId, socket.id);
      socket.join(userId);

      console.log("🔌 New client connected:", socket.user.name);

      io.emit("online-users", Array.from(onlineUsers.keys()));

      // Rooms for video
      socket.on("join-room", ({ roomId }) => {
        socket.join(roomId);
        socket.to(roomId).emit("participant-joined", { user: socket.user });
      });

      // Video signaling
      registerSignalingHandlers(io, socket);

      // Chat
      registerChatHandlers(io, socket, onlineUsers);

      // Cleanup
      socket.on("disconnect", () => {
        onlineUsers.delete(userId);
        io.emit("online-users", Array.from(onlineUsers.keys()));
        console.log("❌ Client disconnected:", socket.user.name);
      });
    });

    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`✅ Server + Socket.IO running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("DB connection failed !!!", err));
