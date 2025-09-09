import Notification from "../models/notification.model.js";
import {asyncHandler} from '../utils/asyncHandler.js'

// get user notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const notifs = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notifs);
});

// mark single notification as read
export const markAsRead = asyncHandler(async (req, res) => {
  const notif = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notif) return res.status(404).json({ message: "Notification not found" });
  res.json(notif);
});

// mark all as read
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { isRead: true });
  res.json({ message: "All notifications marked as read" });
});
