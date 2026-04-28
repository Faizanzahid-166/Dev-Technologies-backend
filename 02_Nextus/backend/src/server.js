// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandler, multerErrorHandler } from "./middlewares/error.middleware.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/meassage.routes.js";
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
server.use(multerErrorHandler)

/* =======================
   ROUTES
======================= */
server.use("/api/auth", authRoutes);
server.use("/api/chat", messageRoutes);
server.get("/api/health", (req, res) => {
      console.log("🔥 Frontend hit backend");
      res.json({ success: true, message: "Backend connected ⚡" });
})

/* =======================
   ERROR HANDLER (LAST)
======================= */
server.use(errorHandler);

export { server };
