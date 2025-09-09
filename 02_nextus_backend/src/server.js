import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware.js";

const server =  express()
server.use(cors({ origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

server.use(express.json({limit:"16kb"}))
server.use(express.urlencoded({extended:true, limit:"16kb"}))
server.use(express.static("public"))
server.use(cookieParser())
server.use(morgan("dev"));


// Error handler
server.use(errorHandler);

import authRoutes from './routes/auth.routes.js'
import profileRoutes from './routes/profile.routes.js'
import meetingRoutes from "./routes/meeting.routes.js";
import messageRoutes from './routes/meassage.routes.js'
import videoRoutes from "./routes/video.routes.js";
import documentRoutes from "./routes/document.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import appwrite from './routes/appwritedocument.routes.js'


// Routes
 server.use("/api/auth", authRoutes);
 server.use("/api/profile", profileRoutes);
 server.use("/api/meetings", meetingRoutes);
server.use("/api/messages", messageRoutes)
 server.use("/api/video", videoRoutes);
 server.use("/api/documents", documentRoutes);
 server.use("/api/payments", paymentRoutes);
 server.use("/api/appwritedocuments", appwrite)


export {server}

