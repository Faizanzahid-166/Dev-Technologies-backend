import mongoose from "mongoose"; // ✅ required
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";

// Send a message
export const sendMessage = asyncHandler(async (req, res) => {
  const { recipient, content } = req.body;

  // Validate recipient ID
  if (!recipient || !mongoose.Types.ObjectId.isValid(recipient)) {
    return res.status(400).json({ error: "Invalid recipient" });
  }

  const userExists = await User.findById(recipient);
  if (!userExists) {
    return res.status(400).json({ error: "Recipient not found" });
  }

  // Generate a consistent conversation ID (sender_recipient sorted)
  const conversationId = [req.user._id.toString(), recipient].sort().join("_");

  const message = await Message.create({
    sender: req.user._id,
    recipient,
    content,
    type: "text",
    conversationId,
  });

  res.status(201).json({ message: "Message sent", data: message });
});

// Get all messages in a conversation
export const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params; // the other user
  const currentUserId = req.user._id.toString();

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  const conversationId = [currentUserId, userId].sort().join("_");

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .populate("sender", "_id name")
    .populate("recipient", "_id name");

  res.json(
    messages.map((m) => ({
      _id: m._id,
      content: m.content,
      sender: m.sender
        ? { _id: m.sender._id, name: m.sender.name }
        : { _id: m.sender?.toString() || "unknown", name: "Unknown" },
      recipient: m.recipient
        ? { _id: m.recipient._id, name: m.recipient.name }
        : { _id: m.recipient?.toString() || "unknown", name: "Unknown" },
      createdAt: m.createdAt,
    }))
  );
});

// Mark all messages as read in a conversation
export const markAsRead = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const conversationId =
    [req.user.id, userId].sort().join("_");

  await Message.updateMany(
    { conversationId, recipient: req.user.id, status: { $ne: "read" } },
    { $set: { status: "read" } }
  );

  res.json({ message: "Messages marked as read" });
});
