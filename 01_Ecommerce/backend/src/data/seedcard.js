import "../config/dotenv.js"; // ✅ MUST be first

import mongoose from "mongoose";
import connectDB from "../database/database.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

try {
  await connectDB();

  console.log("⏳ Seeding cart data...");

  // Clear existing cart data
  await Cart.deleteMany();

  // Get the first user
  const user = await User.findOne();

  if (!user) {
    console.error("❌ No user found. Please seed user first.");
    process.exit(1);
  }

  // Get products
  const products = await Product.find();

  if (!products.length) {
    console.error("❌ No products found. Please seed products first.");
    process.exit(1);
  }

  // Random items
  const items = products
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((p) => ({
      product: p._id,
      quantity: Math.floor(Math.random() * 3) + 1,
    }));

  // Create cart
  await Cart.create({
    userId: user._id,
    items,
  });

  console.log(
    `✅ Cart created for user ${user._id} with ${items.length} items.`
  );

  process.exit(0);

} catch (err) {
  console.error("❌ Error seeding cart:", err.message);
  process.exit(1);
}