import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["message", "meeting", "document", "system"],
      default: "system",
    },
    content: { type: String, required: true },
    link: { type: String }, // optional URL (e.g. /chat/123)
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
