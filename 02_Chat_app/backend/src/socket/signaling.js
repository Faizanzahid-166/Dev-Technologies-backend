// src/socket/signaling.js
import { roomsStore } from "./store.js";

/**
 * Signaling events for video calls:
 * 1) join-room
 * 2) webrtc-offer
 * 3) webrtc-answer
 * 4) webrtc-ice-candidate
 * 5) toggle-media
 * 6) leave-room
 * 7) disconnect cleanup
 */

export default function registerSignalingHandlers(io, socket) {
  if (!socket.user) {
    console.warn("Socket has no user attached:", socket.id);
    return;
  }

  // --- Join room ---
  socket.on("join-room", ({ roomId }) => {
    if (!roomId) return console.warn("join-room called without roomId");

    socket.join(roomId);

    // Add participant to in-memory store
    roomsStore.addParticipant(roomId, {
      socketId: socket.id,
      userId: socket.user.id,
      name: socket.user.name,
      role: socket.user.role,
    });

    // Notify others
    socket.to(roomId).emit("participant-joined", {
      socketId: socket.id,
      userId: socket.user.id,
      name: socket.user.name,
      role: socket.user.role,
    });

    // Send current participants back to the joiner
    const participants = roomsStore.getParticipants(roomId)
      .filter(p => p.socketId !== socket.id);
    socket.emit("room-participants", participants);
  });

  // --- WebRTC offer ---
  socket.on("webrtc-offer", ({ roomId, sdp }) => {
    if (!roomId || !sdp) return;
    socket.to(roomId).emit("webrtc-offer", { from: socket.id, sdp });
  });

  // --- WebRTC answer ---
  socket.on("webrtc-answer", ({ roomId, sdp }) => {
    if (!roomId || !sdp) return;
    socket.to(roomId).emit("webrtc-answer", { from: socket.id, sdp });
  });

  // --- ICE candidates ---
  socket.on("webrtc-ice-candidate", ({ roomId, candidate }) => {
    if (!roomId || !candidate) return;
    socket.to(roomId).emit("webrtc-ice-candidate", { from: socket.id, candidate });
  });

  // --- Toggle media (UI sync) ---
  socket.on("toggle-media", ({ roomId, kind, enabled }) => {
    if (!roomId || !kind) return;
    socket.to(roomId).emit("toggle-media", {
      userId: socket.user.id,
      kind,
      enabled,
    });
  });

  // --- Leave room ---
  socket.on("leave-room", ({ roomId }) => {
    if (!roomId) return;
    socket.leave(roomId);
    roomsStore.removeParticipant(roomId, socket.id);
    socket.to(roomId).emit("participant-left", { socketId: socket.id });
  });

  // --- Disconnect cleanup ---
  socket.on("disconnect", () => {
    const rooms = roomsStore.getRoomsBySocket(socket.id) || [];
    rooms.forEach((roomId) => {
      socket.leave(roomId);
      roomsStore.removeParticipant(roomId, socket.id);
      socket.to(roomId).emit("participant-left", { socketId: socket.id });
    });
  });
}
