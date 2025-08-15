// controllers/productController.js
import Product from '../models/product.model.js';
import mongoose from 'mongoose';
import { uploadCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

// ===============================
// GET ALL PRODUCTS (with search, filter, pagination)
// ===============================
export const getAllProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

       // Filters
    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    // Pagination setup
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

     // Query DB
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limitNum) // fix here
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===============================
// GET PRODUCT BY ID
// ===============================
export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID format' });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ===============================
// CREATE PRODUCT
// ===============================



export const createProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required"
      });
    }

    let imageUrl = null;

    if (req.file) {
      const cloudinaryResult = await uploadCloudinary(req.file.path);
      imageUrl = cloudinaryResult.secure_url;

      // Remove local file after upload
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.error("File cleanup failed:", cleanupErr);
      }
    }

    const product = new Product({
      name,
      price,
      category,
      description,
      image: imageUrl
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error"
    });
  }
};


// ===============================
// UPDATE PRODUCT
// ===============================
export const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID format' });
  }

  try {
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product updated successfully', product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ===============================
// DELETE PRODUCT
// ===============================
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID format' });
  }

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
