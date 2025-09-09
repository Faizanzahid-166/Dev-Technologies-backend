// src/routes/message.routes.js
import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { sendMessage, getMessages,markAsRead } from "../controllers/message.contoller.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:userId", protect, getMessages);
router.put("/:userId/read", protect, markAsRead);

export default router;
