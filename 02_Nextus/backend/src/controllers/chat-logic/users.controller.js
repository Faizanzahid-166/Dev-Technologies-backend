// controllers/user.controller.js
import User from "../../models/user.model.js"
import Conversation from "../../models/conversation.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getAllUsersForChat = asyncHandler(async (req, res) => {
  const myId = req.user._id;

  // Get all users except me
  const users = await User.find({ _id: { $ne: myId } }, "name email avatar");

  // Get last message for each user
  const usersWithLastMessage = await Promise.all(
    users.map(async (user) => {
      // Find conversation with this user
      const conversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [myId, user._id] },
      }).populate("lastMessage");

      return {
        ...user.toObject(),
        lastMessage: conversation?.lastMessage || null,
        conversationId: conversation?._id || null,
      };
    })
  );

  res.json({
    success: true,
    users: usersWithLastMessage,
  });
});
