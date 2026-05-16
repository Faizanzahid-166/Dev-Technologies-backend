import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser'
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import morgan  from 'morgan';
import rateLimit from 'express-rate-limit';


const server = express();


// _______ CORS Configuration _________________________________________________
const allowedOrigins = [
  'http://localhost:5173', // local dev
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

// depenedencies

if (process.env.NODE_ENV === 'development') {
  server.use(morgan('dev'));
}
server.use(express.json({limit:"16kb"}))
server.use(helmet());
server.use(express.urlencoded({extended:true, limit:"16kb"}))
server.use(express.static("public"))
server.use(cookieParser())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: 'Too many requests from this IP, please try again later.',
});
server.use('/api', limiter);

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

// ─── API Routes ───────────────────────────────────────────────────────────────
 import authRoutes from  './routes/user/auth.Routes.js'
import blogRoutes from './routes/blog/blog.Routes.js';
import uploadRoutes from './routes/blog/upload.Routes.js';
import categoryRoutes from './routes/blog/category.Routes.js';
import analyticsRoutes from './routes/blog/analytics.Routes.js';
import commentRoutes from './routes/blog/comment.Routes.js';
import newsletterRoutes from './routes/blog/newsletter.Routes.js';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static uploads
server.use('/uploads', express.static('public/uploads'));
 
// // Routes
server.use('/api/auth', authRoutes);
server.use('/api/blogs', blogRoutes);
server.use('/api/upload', uploadRoutes);
server.use('/api/categories', categoryRoutes);
server.use('/api/analytics', analyticsRoutes);
server.use('/api/comments', commentRoutes);
server.use('/api/newsletter', newsletterRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
import { ErrorHandler, notFound } from './middlewares/error.middleware.js';
server.use(notFound);
server.use(ErrorHandler);

export {server};