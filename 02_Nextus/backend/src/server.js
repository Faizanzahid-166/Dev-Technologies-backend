// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import messageRoutes from "./routes/meassage.routes.js";
import videoRoutes from "./routes/video.routes.js";
import documentRoutes from "./routes/document.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import appwriteRoutes from "./routes/appwritedocument.routes.js";

const server = express();

/* =======================
   CORS CONFIG (FIXED)
======================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://dev-technologies-frontend-9xqc.vercel.app",
];

server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // postman / server-to-server
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* =======================
   MIDDLEWARES
======================= */
server.use(express.json({ limit: "16kb" }));
server.use(express.urlencoded({ extended: true, limit: "16kb" }));
server.use(express.static("public"));
server.use(cookieParser());
server.use(morgan("dev"));

/* =======================
   ROUTES
======================= */
server.use("/api/auth", authRoutes);
server.use("/api/profile", profileRoutes);
server.use("/api/meetings", meetingRoutes);
server.use("/api/chat", messageRoutes);
server.use("/api/video", videoRoutes);
server.use("/api/documents", documentRoutes);
server.use("/api/payments", paymentRoutes);
server.use("/api/appwritedocuments", appwriteRoutes);

/* =======================
   ERROR HANDLER (LAST)
======================= */
server.use(errorHandler);

export { server };
