import api from "../config/axiosConfig.js";

/* -------- CHAT -------- */

// create or open 1-to-1 conversation
export const createOrGetConversationApi = (receiverId) =>
  api.post("/api/chat/conversation", { receiverId }).then(res => res.data);

// my conversations list (WhatsApp left sidebar)
export const getMyConversationsApi = () =>
  api.get("/api/chat/conversations").then(res => res.data);

// send message
export const sendMessageApi = ({ conversationId, text }) =>
  api.post("/api/chat/message", { conversationId, text }).then(res => res.data);

// get messages of a conversation
export const getConversationMessagesApi = (conversationId) =>
  api.get(`/api/chat/messages/${conversationId}`).then(res => res.data);

// get all users for new chat
export const getAllUsersForChatApi = () =>
  api.get("/api/chat/chat-users").then(res => res.data);
