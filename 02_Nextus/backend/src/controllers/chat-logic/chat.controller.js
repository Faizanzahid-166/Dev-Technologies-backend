import Conversation from "../../models/chat/conversation.model.js";
import Message from "../../models/chat/message.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiSuccess, ApiError } from "../../utils/apiResponse.js";
import { getUserFromCookies } from "../../lib/getUserFromCookies.js";

/* ---------------------------------------------
   CREATE OR GET 1-TO-1 CONVERSATION
--------------------------------------------- */
export const createOrGetConversation = asyncHandler(async (req, res) => {
  const user = await getUserFromCookies(req);
  if (!user) throw new ApiError(401, "Unauthorized");
 
  const { receiverId } = req.body;
  if (!receiverId) throw new ApiError(400, "Receiver ID is required");

  let conversation = await Conversation.findOne({
    isGroup: false,
    participants: { $all: [user._id, receiverId] },
    $expr: { $eq: [{ $size: "$participants" }, 2] },
  })
    .populate("participants", "name email avatar")
    .populate("lastMessage");

  if (conversation) {
    return res
      .status(200)
      .json(new ApiSuccess(200, conversation, "Conversation found"));
  }

  conversation = await Conversation.create({
    participants: [user._id, receiverId],
    isGroup: false,
  });

  const populatedConversation = await Conversation.findById(conversation._id)
    .populate("participants", "name email avatar");

  res
    .status(201)
    .json(new ApiSuccess(201, populatedConversation, "Conversation created"));
});


export const sendMessage = asyncHandler(async (req, res) => {
  const user = await getUserFromCookies(req);
  if (!user) throw new ApiError(401, "Unauthorized");

  const { conversationId, text, attachments } = req.body;

  if (!conversationId || (!text && !attachments?.length)) {
    throw new ApiError(400, "Message content required");
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new ApiError(404, "Conversation not found");

  // 🔴 IMPORTANT FIX
  const isParticipant = conversation.participants.some(
    (id) => id.toString() === user._id.toString()
  );

  if (!isParticipant) throw new ApiError(403, "Access denied");

  const message = await Message.create({
    conversationId,
    sender: user._id,
    text,
    attachments,
    seenBy: [user._id],
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  const populatedMessage = await Message.findById(message._id)
    .populate("sender", "name email avatar");

  res
    .status(201)
    .json(new ApiSuccess(201, populatedMessage, "Message sent"));
});


export const getMyConversations = asyncHandler(async (req, res) => {
  const user = await getUserFromCookies(req);
  if (!user) throw new ApiError(401, "Unauthorized");

  const conversations = await Conversation.find({
    participants: user._id,
  })
    .populate("participants", "name email avatar")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "name email avatar" },
    })
    .sort({ updatedAt: -1 });

  res
    .status(200)
    .json(new ApiSuccess(200, conversations, "Conversations fetched"));
});


export const getConversationMessages = asyncHandler(async (req, res) => {
  const user = await getUserFromCookies(req);
  if (!user) throw new ApiError(401, "Unauthorized");

  const { conversationId } = req.params;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new ApiError(404, "Conversation not found");

  const isParticipant = conversation.participants.some(
    (id) => id.toString() === user._id.toString()
  );

  if (!isParticipant) throw new ApiError(403, "Access denied");

  const messages = await Message.find({ conversationId })
    .populate("sender", "name email avatar")
    .sort({ createdAt: 1 });

  res
    .status(200)
    .json(new ApiSuccess(200, messages, "Messages fetched"));
}); 
