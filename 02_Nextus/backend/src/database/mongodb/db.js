import mongoose from "mongoose";
import { DB_NAME } from "./constant.js";
import { createRootAdmin } from "../../lib/createRootAdmin.js"; // your admin creation utility

const connectDB = async () => {
  try {
    if (!process.env.MONGO_DB_URL) {
      throw new Error("MONGO_DB_URL is not set in environment variables");
    }

    // Connect to MongoDB without deprecated options
    const connection = await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`);

    console.log(`✅ MongoDB connected! DB HOST: ${connection.connection.host}`);

    // Automatically create root admin if it doesn't exist
    await createRootAdmin();
  } catch (error) {
    console.error("🔥 MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
