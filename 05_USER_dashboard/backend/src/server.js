import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser'

import helmet from 'helmet';
import morgan  from 'morgan';
 


const server = express();


// _______ CORS Configuration _________________________________________________
const allowedOrigins = [
  'http://localhost:5173', // local dev
  'https://dev-technologies-frontend.vercel.app', // old frontend URL
  // new frontend URL
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
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
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
server.use(express.json({limit:"16kb"}))
server.use(helmet());
server.use(express.urlencoded({extended:true, limit:"16kb"}))
server.use(express.static("public"))
server.use(cookieParser())




// ─── API Routes ───────────────────────────────────────────────────────────────
 import authRoutes from  './routes/auth.Routes.js'
 import userRoutes from  './routes/user.Routes.js'
 import dependencyRoutes from './routes/dependency.Routes.js'

 server.use('/api/auth', authRoutes);
 server.use('/api/user', userRoutes);
 server.use('/api/dependencies', dependencyRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
import { ErrorHandler, notFound } from './middlewares/error.middleware.js';
server.use(notFound);
server.use(ErrorHandler);

export {server};