import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser'

import helmet from 'helmet';
import morgan  from 'morgan';
 


const server = express();

const allowedOrigins = [
  'http://localhost:5173', // local dev
];

server.use(cors({
    origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) or matching origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
    credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
     allowedHeaders: ['Content-Type', 'Authorization'],
}))
server.use(express.json({limit:"16kb"}))
server.use(helmet());
server.use(express.urlencoded({extended:true, limit:"16kb"}))
server.use(express.static("public"))
server.use(cookieParser())


// ─── Health Check ─────────────────────────────────────────────────────────────
server.get("/api/health", (req, res) => {
      console.log("🔥 Frontend hit backend");
      res.status(200).json({
    status: 'healthy',
    success: true, message: "Backend connected ⚡",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
      
})
if (process.env.NODE_ENV === 'development') {
  server.use(morgan('dev'));
}


// ─── API Routes ───────────────────────────────────────────────────────────────
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';


server.use('/api/auth', authRoutes);
server.use('/api/tasks', taskRoutes);
server.use('/api/users', userRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
import errorHandler from './middleware/errorHandler.js';
server.use(errorHandler);

export {server};