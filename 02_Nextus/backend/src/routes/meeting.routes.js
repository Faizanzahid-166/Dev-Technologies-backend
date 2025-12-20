// src/routes/meeting.routes.js
import express from "express";
import { createMeeting, acceptMeeting, rejectMeeting, completeMeeting,getMyMeetings,clearRejectedMeetings } from "../controllers/meetng.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Schedule meeting → only entrepreneurs can schedule meetings with investors
router.post("/", protect, authorize("entrepreneur"), createMeeting);

// Accept / Reject → only investors can accept/reject meetings
router.put("/:id/accept", protect, acceptMeeting);
router.put("/:id/reject", protect, rejectMeeting);


// DELETE all rejected meetings for the logged-in user
router.delete("/clear-rejected", protect, clearRejectedMeetings);

//complete meeting
router.put("/:id/complete", protect, completeMeeting);

// Get my meetings → any logged-in user
router.get("/my", protect, getMyMeetings);

export default router;

