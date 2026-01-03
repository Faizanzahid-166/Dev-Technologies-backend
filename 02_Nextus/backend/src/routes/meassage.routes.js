import express from "express";
import {
  createOrGetConversation,
  sendMessage,
  getMyConversations,
  getConversationMessages,
} from "../controllers/chat-logic/chat.controller.js";
import  { getAllUsersForChat }  from '../controllers/chat-logic/users.controller.js'
import {protect} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/conversation", protect, createOrGetConversation);
router.get("/conversations", protect, getMyConversations);
router.post("/message", protect, sendMessage);
router.get("/messages/:conversationId", protect, getConversationMessages);
router.get("/chat-users", protect, getAllUsersForChat);

export default router;
