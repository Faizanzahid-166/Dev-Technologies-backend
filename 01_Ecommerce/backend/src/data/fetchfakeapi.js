// src/data/fetchfakeapi.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import fetch from "node-fetch";
import Product from "../models/product.model.js";
import connectDB from "../config/database.js";

dotenv.config();

const seedProducts = async () => {
  try {
    await connectDB();

    console.log("⏳ Fetching products from EscuelaJS API...");
    const res = await fetch("https://api.escuelajs.co/api/v1/products");
    if (!res.ok) throw new Error("Failed to fetch products from API");
    const apiProducts = await res.json();

    // Optional: clear old data
    await Product.deleteMany();
    console.log("🗑 Old products cleared.");

    const products = apiProducts.map(p => ({
      name: p.title,
      price: p.price,
      image: p.images?.[0] || "", // use first image
      description: p.description || "",
      category: p.category?.name || "Misc", // extract category name
      stock: Math.floor(Math.random() * 50) + 1
    }));

    // Insert products safely
    for (const prod of products) {
      try {
        await Product.create(prod);
      } catch (err) {
        if (err.code === 11000) {
          console.log(`⚠️ Duplicate skipped: ${prod.name}`);
        } else {
          console.error(`❌ Failed to insert: ${prod.name}`, err.message);
        }
      }
    }

    console.log(`✅ ${products.length} products inserted successfully!`);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding products:", err.message);
    process.exit(1);
  }
};

seedProducts();
