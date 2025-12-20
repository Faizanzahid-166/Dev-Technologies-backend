// src/models/message.model.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    conversationId: { type: String, index: true }, // e.g., user1_user2
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    fileUrl: { type: String }, // optional for image/file
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { timestamps: true }
);

messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);

