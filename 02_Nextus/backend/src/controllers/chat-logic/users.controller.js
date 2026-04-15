// controllers/user.controller.js
import User from "../../models/user.model.js";
import Conversation from "../../models/chat/conversation.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiSuccess, ApiError } from "../../utils/apiResponse.js";
 
/**
 * Get all users for chat (WhatsApp-style list)
 * @route GET /api/chat/chat-users
 * @access Private
 */
export const getAllUsersForChat = asyncHandler(async (req, res) => {
  const myId = req.user._id;

  // 1️⃣ Get all users except logged-in user
  const users = await User.find(
    { _id: { $ne: myId } },
    "name email avatar"
  ).lean();

  // 2️⃣ Attach conversation + last message for each user
  const usersWithChatMeta = await Promise.all(
    users.map(async (user) => {
      const conversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [myId, user._id] },
        $expr: { $eq: [{ $size: "$participants" }, 2] },
      })
        .populate({
          path: "lastMessage",
          populate: { path: "sender", select: "name email" },
        })
        .lean();

      return {
        ...user,
        conversationId: conversation?._id || null,
        lastMessage: conversation?.lastMessage || null,
      };
    })
  );

  return res
    .status(200)
    .json(new ApiSuccess(200, usersWithChatMeta, "Chat users fetched"));
});
