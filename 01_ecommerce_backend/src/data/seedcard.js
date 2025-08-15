
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/database.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

dotenv.config();

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

  // Get some products
  const products = await Product.find();
  if (!products.length) {
    console.error("❌ No products found. Please seed products first.");
    process.exit(1);
  }

  // Pick 3 random products
  const items = products
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((p) => ({
      product: p._id,
      quantity: Math.floor(Math.random() * 3) + 1,
    }));

  // Create the cart
  await Cart.create({
    userId: user._id,
    items,
  });

  console.log(`✅ Cart created for user ${user._id} with ${items.length} items.`);
  process.exit(0);

} catch (err) {
  console.error("❌ Error seeding cart:", err.message);
  process.exit(1);
}
