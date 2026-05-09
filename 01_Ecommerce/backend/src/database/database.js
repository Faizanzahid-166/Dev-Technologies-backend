import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
// import { createRootAdmin } from "../../lib/createRootAdmin.js"; // your admin creation utility

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set in environment variables");
    }

    // Connect to MongoDB without deprecated options
    const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    console.log(`✅ MongoDB connected! DB HOST: ${connection.connection.host}`);
    console.log(DB_NAME, "database");


    // Automatically create root admin if it doesn't exist
    // await createRootAdmin();
  } catch (error) {
    console.error("🔥 MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
