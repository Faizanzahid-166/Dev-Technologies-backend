// src/controllers/meeting.controller.js
import Meeting from "../models/meeting.model.js";
import {asyncHandler} from '../utils/asyncHandler.js'

// Schedule a new meeting
import mongoose from "mongoose";

export const createMeeting = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      console.log("User from token in createMeeting:", req.user);
      return res.status(401).json({ message: "Unauthorized: No user attached" });
    }

    const { title, description, date, participants } = req.body;

    // ✅ Defensive check
    if (!title || !date || !participants || !Array.isArray(participants)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const meeting = new Meeting({
      title,
      description,
      date,
      createdBy: req.user._id, 
      participants: participants.map((p) => ({
        user: p.user,
        role: p.role,
        response: "Pending",
      })),
    });

    await meeting.save();

    return res.status(201).json({
      message: "Meeting scheduled successfully",
      meeting,
    });
  } catch (err) {
    console.error("Create meeting error:", err);
    return res.status(500).json({
      message: "Error scheduling meeting",
      error: err.message,
    });
  }
};


// accept meeting

export const acceptMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    const userId = req.user._id.toString();

    console.log("Current userId:", userId);
    console.log("Participants in meeting:", meeting.participants);

    // Fix: check p.user exists before calling .toString()
    const participant = meeting.participants.find(
      (p) => p.user && p.user.toString() === userId
    );

    if (!participant) {
      return res.status(403).json({ message: "You are not a participant in this meeting" });
    }

    participant.response = "Accepted";

    // If all participants accepted, update status
    const allAccepted = meeting.participants.every(
      (p) => p.user && p.response === "Accepted"
    );
    if (allAccepted) {
      meeting.status = "Accepted";
    }

    await meeting.save();

    res.json({
      message: "You have accepted the meeting",
      meeting,
    });
  } catch (err) {
    console.error("Accept meeting error:", err);
    res.status(500).json({ message: "Error accepting meeting", error: err.message });
  }
};



// Reject meeting
export const rejectMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    const participant = meeting.participants.find(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (!participant) return res.status(403).json({ message: "You are not a participant in this meeting" });

    participant.response = "Rejected";

    // If anyone rejects, meeting becomes Rejected
    meeting.status = "Rejected";

    await meeting.save();
    res.json({ message: "You have rejected the meeting", meeting });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting meeting", error: err.message });
  }
};

// Mark meeting as completed
export const completeMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findById(id).populate("createdBy", "name email");
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // Only creator of the meeting can mark it completed
    if (meeting.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the meeting creator can complete the meeting",
      });
    }

    // Allow only accepted meetings to be completed
    if (meeting.status !== "Accepted") {
      return res.status(400).json({
        message: `Only accepted meetings can be marked as completed (current: ${meeting.status})`,
      });
    }

    meeting.status = "Completed";
    meeting.completedAt = new Date(); // optional: track when it was completed
    await meeting.save();

    res.json({
      message: "Meeting marked as completed",
      meeting,
    });
  } catch (err) {
    console.error("Error completing meeting:", err);
    res.status(500).json({
      message: "Error completing meeting",
      error: err.message,
    });
  }
};

// Get my meetings
export const getMyMeetings = asyncHandler(async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [
        { createdBy: req.user.id },
        { "participants.user": req.user.id }
      ]
    }).populate("participants.user", "name email role");

    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching meetings", error: err.message });
  }
});

// Clear all rejected meetings created by or involving the user
export const clearRejectedMeetings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete rejected meetings where user is creator or participant
    await Meeting.deleteMany({
      status: "Rejected",
      $or: [
        { createdBy: userId },
        { "participants.user": userId }
      ],
    });

    res.json({ message: "Rejected meetings cleared" });
  } catch (error) {
    console.error("Error clearing rejected meetings:", error);
    res.status(500).json({ message: "Server error" });
  }
};
