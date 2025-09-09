import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["investor", "entrepreneur"],
      required: true,
      lowercase: true, // automatically convert to lowercase
    },
    profile: {
      bio: { type: String, default: "" },
      startupHistory: [{ type: String }], // for entrepreneurs
      investmentHistory: [{ type: String }], // for investors
      preferences: [{ type: String }], // e.g. preferred industries
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
