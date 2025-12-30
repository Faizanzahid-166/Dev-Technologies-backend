import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: { type: String, required: true, select: false },

  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer"
  },

  // ✅ Customer category
customerType: {
  type: String,
  trim: true,
  required: true
},

  isRoot: { type: Boolean, default: false },

  avatar: { type: String, default: "" },

  emailVerified: { type: Boolean, default: false },

  otp: {
    code: String,
    expiresAt: Date
  }

}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
