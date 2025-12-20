import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/product.model.js";
import connectDB from "../config/database.js";
import moduleName from '../assets'

dotenv.config();

const products = [
  {
    name: "TWS Bluetooth Earbuds",
    price: 25.99,
    image: "/images/earbuds.png",
    description: "Wireless earbuds with noise cancellation and long battery life.",
    category: "Electronics",
    stock: 40,
  },
  {
    name: "Waterproof Smartwatch",
    price: 59.99,
    image: "/images/smartwatch.png",
    description: "Track fitness and receive notifications on the go.",
    category: "Wearables",
    stock: 25,
  },
  {
    name: "Men's Winter Jacket",
    price: 89.99,
    image: "/images/jacket.png",
    description: "Stay warm and stylish with this premium winter jacket.",
    category: "Clothing",
    stock: 15,
  },
  {
    name: "Portable Bluetooth Speaker",
    price: 45.0,
    image: "/images/speaker.png",
    description: "Compact speaker with rich sound and deep bass.",
    category: "Electronics",
    stock: 60,
  },
  {
    name: "Classic Leather Wallet",
    price: 19.99,
    image: "/images/wallet.png",
    description: "Genuine leather wallet with multiple compartments.",
    category: "Accessories",
    stock: 100,
  },
];

const seedData = async () => {
  try {
    await connectDB();
    await Product.deleteMany(); // Clear old data
    await Product.insertMany(products);
    console.log("✅ Sample products inserted");
    process.exit();
  } catch (err) {
    console.error("❌ Error inserting sample data:", err.message);
    process.exit(1);
  }
};

seedData();
