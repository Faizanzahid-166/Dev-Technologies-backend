import express from "express";
import { v4 as uuidv4 } from "uuid";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create a room (returns roomId)
// Create a new video call room
router.post("/create-room", (req, res) => {
  const roomId = uuidv4();
  res.json({ roomId });
});

// Join a room (optional)
router.post("/join", (req, res) => {
  const { roomId } = req.body;
  if (!roomId) {
    return res.status(400).json({ message: "Room ID is required" });
  }
  res.json({ success: true, roomId });
});
export default router;
