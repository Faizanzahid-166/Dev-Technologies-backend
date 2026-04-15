import Client from "../config/Client.js";

/* -------- CHAT -------- */

// create or open 1-to-1 conversation
export const createOrGetConversationApi = async (receiverId) => {
  const res = await Client.post("/api/chat/conversation", { receiverId });
  return res.data.data; // ApiSuccess → data
};

// my conversations list (WhatsApp left sidebar)
export const getMyConversationsApi = async () => {
  const res = await Client.get("/api/chat/conversations");
  return res.data.data;
};

// send message (text + attachments support)
export const sendMessageApi = async ({
  conversationId,
  text = "",
  attachments = [],
}) => {
  const res = await Client.post("/api/chat/message", {
    conversationId,
    text,
    attachments,
  });
  return res.data.data;
};

// get messages of a conversation
export const getConversationMessagesApi = async (conversationId) => {
  const res = await Client.get(`/api/chat/messages/${conversationId}`);
  return res.data.data;
};

// get all users for starting new chat
export const getAllUsersForChatApi = async () => {
  const res = await Client.get("/api/chat/chat-users");
  return res.data.data;
};

