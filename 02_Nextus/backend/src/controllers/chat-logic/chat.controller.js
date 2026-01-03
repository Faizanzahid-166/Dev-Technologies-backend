import Conversation from "../../models/conversation.model.js"
import Message from "../../models/message.model.js"

/**
 * Create or get a 1-to-1 conversation
 * @route POST /api/chat/conversation
 */
export const createOrGetConversation = async (req, res) => {
  try {
    const userId = req.user.id;           // logged-in user
    const { receiverId } = req.body;      // other user

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required",
      });
    }

    // 1️⃣ Check if conversation already exists
    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [userId, receiverId] },
      $expr: { $eq: [{ $size: "$participants" }, 2] },
    })
      .populate("participants", "name email")
      .populate("lastMessage");

    if (conversation) {
      return res.status(200).json({
        success: true,
        conversation,
      });
    }

    // 2️⃣ Create new conversation
    conversation = await Conversation.create({
      participants: [userId, receiverId],
      isGroup: false,
    });

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("participants", "name email");

    res.status(201).json({
      success: true,
      conversation: populatedConversation,
    });

  } catch (error) {
    console.error("Create conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Send a message
 * @route POST /api/chat/message
 */
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId, text, attachments } = req.body;

    if (!conversationId || (!text && !attachments?.length)) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    // 1️⃣ Create message
    const message = await Message.create({
      conversationId,
      sender: userId,
      text,
      attachments,
      seenBy: [userId],
    });

    // 2️⃣ Update last message in conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email");

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });

  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get all conversations for logged-in user
 * @route GET /api/chat/conversations
 */
export const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "name email",
        },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });

  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get messages of a conversation
 * @route GET /api/chat/messages/:conversationId
 */
export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });

  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
