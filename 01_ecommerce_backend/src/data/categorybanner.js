
import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/categorymodel.js";
import connectDB from "../config/database.js";
dotenv.config();

try {
   await connectDB();
  
    console.log("⏳ Seeding cart data...");
  
  const seedData = async () => {
    await connectDB();
  
    await Category.deleteMany();
   
    await Category.insertMany([
  { name: "acer", image: "/uploads/acer.png" },
  { name: "camera", image: "/uploads/camera.jpg" },
  { name: "dron", image: "/uploads/dron,png" }
]);

  
    console.log("Data Seeded");
    process.exit();
    
  };
  seedData();
} catch (error) {
  console.log(error);
  
}

