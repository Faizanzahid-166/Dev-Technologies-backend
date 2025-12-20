// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true,  unique: true },
  image: { type: String, required: true ,   unique: true},
    //images: [{ type: String }], // array of image URLs
  price: { type: Number, required: true },
  description: String,
  //category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  category: {
  type: String,
  required: true
},
  stock: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
