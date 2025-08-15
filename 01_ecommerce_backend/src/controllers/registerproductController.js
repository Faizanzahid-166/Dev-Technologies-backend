import Banner from "../models/bannermodel.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import mongoose from 'mongoose'

export const registerbanner = async (req, res) => {
   console.log("✅ registerProduct called");
   console.log("📩 Request body:", req.body);
   console.log("📷 Uploaded file:", req.file);

  try {
    const { name, description, price, category } = req.body;

     console.log("📩 Request body:", req.body);
      console.log("📷 Uploaded file:", req.file);

    // Upload image to Cloudinary
    const uploadResult = await uploadCloudinary(req.file.path);

    console.log(uploadResult);

    // 1. Check for duplicate product by name
    const existingProduct = await Banner.findOne({ name, });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product already exists",
      });

    } 
   
    const { alreadyExists, url } = await uploadCloudinary(req.file.path);
    if ( alreadyExists) {
    return res.status(400).json({ success: false, message: "Image already exists" });
    }
    

    // Save product to MongoDB
    const product = new Banner({
      name,
      description,
      price,
      category,
      image: url,
    });

  


    await product.save();

    res.status(201).json({ message: "Product created", product });
  } catch (err) {
      console.error("❌ Error in registerProduct:", err);
    res.status(500).json({ error: err.message });
    console.log(res.status);
    
  }
};

// Get all banners
export const getBanners = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    const banners = await Banner.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID format' });
  }

  try {
    const product = await Banner.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



