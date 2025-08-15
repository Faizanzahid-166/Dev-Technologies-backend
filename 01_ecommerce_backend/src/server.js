import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser'
import productRoutes from './routes/productRoute.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoute.js';
import categoryRoutes from './routes/categoryRoutes.js'
import ownProductRoute from './routes/fileuoloadRoute.js'
import contactRoute from "./routes/contactRoute.js";


const server = express();

const allowedOrigins = ['http://localhost:5173', 'https://dev-technologies-frontend.vercel.app'];

server.use(cors({
    origin: allowedOrigins,
    credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization'],
}))
server.use(express.json({limit:"16kb"}))
server.use(express.urlencoded({extended:true, limit:"16kb"}))
server.use(express.static("public"))
server.use(cookieParser())


// app.use(cors());
// app.use(express.json());

server.use('/api/products', productRoutes);
server.use('/api/auth', authRoutes);
server.use('/api/cart', cartRoutes);
server.use("/api/categories", categoryRoutes);
server.use("/api/ownproduct", ownProductRoute)
server.use("/api/contact", contactRoute);

export {server};