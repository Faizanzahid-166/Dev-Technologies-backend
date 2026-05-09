// src/sockets/chat.handlers.js
import Message from "../models/message.model.js";
import { sendNotification } from "../utils/sendNotification.js";

export const registerChatHandlers = (io, socket) => {
  // Join personal room = userId
  socket.join(socket.user.id);

  socket.on("send-message", async ({ recipient, content, type = "text" }, callback) => {
    try {
      if (!recipient || recipient === socket.user.id) {
        if (callback) callback({ success: false, error: "Invalid recipient" });
        return;
      }

      const newMsg = await Message.create({
        sender: socket.user.id,
        recipient,
        content,
        type,
      });

      // Populate sender & recipient for frontend consistency
      const populatedMsg = await newMsg.populate(["sender", "recipient"]);

      // Deliver only once to sender
      io.to(socket.user.id).emit("new-message", populatedMsg);

      // Deliver to recipient if online
      io.to(recipient).emit("new-message", populatedMsg);

      // Acknowledge back
      if (callback) callback({ success: true, message: populatedMsg });

      // Push notification
      await sendNotification(
        io,
        recipient,
        "message",
        "You have a new message",
        `/chat/${socket.user.id}`
      );
    } catch (err) {
      console.error("send-message error:", err);
      if (callback) callback({ success: false, error: "Failed to send message" });
      socket.emit("message-error", { message: "Failed to send message" });
    }
  });
};
