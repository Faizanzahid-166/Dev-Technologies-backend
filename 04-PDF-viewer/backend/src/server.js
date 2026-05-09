import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser'


const server = express();

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
server.use(express.json({}))   //limit:"16kb"
//server.use(express.static("public"))
server.use(cookieParser())
server.use(express.urlencoded({ extended: true }));

// Routes
import pdfRoutes from "./routes/pdfRoutes.js";

server.get("/api/health", (req, res) => {
      console.log("🔥 Frontend hit backend");
      res.json({ success: true, message: "Backend connected ⚡" });
})

server.use("/api/pdfs", pdfRoutes);

// Global error handler
server.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});




export {server};