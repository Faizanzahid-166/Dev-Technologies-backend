import Notification from "../models/notification.model.js";

async function sendNotification(io, userId, type, content, link) {
  const notif = await Notification.create({ user: userId, type, content, link });
  io.to(userId.toString()).emit("notification:new", notif);
}

export { sendNotification };
