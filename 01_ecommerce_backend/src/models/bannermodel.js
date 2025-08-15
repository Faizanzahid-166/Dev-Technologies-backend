import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
    unique: true,
  },
   name: { type: String, required: true,  unique: true },
    price: { type: Number, required: true },
    description: String,
    // category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
      category: {
  type: String,
  required: true
},
    stock: { type: Number, default: 0 },
  }, { timestamps: true });

export default mongoose.model("Banner", bannerSchema);
