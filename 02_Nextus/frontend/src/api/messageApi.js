// src/api/messageApi.js
import api from "./axiosConfig.js";


// Send a message
export const sendMessage = async (recipient, content) => {
  const { data } = await api.post("/messages", { recipient, content });
  return data.data; // return only the saved message object
};


// Get all messages with a specific user
export const getMessages = async (userId) => {
  const { data } = await api.get(`/messages/${userId}`);
  return data; // array of normalized messages
};


// Mark all messages from a user as read
export const markMessagesAsRead = async (userId) => {
  const { data } = await api.put(`/messages/${userId}/read`);
  return data;
};


// Create a new video call room
// messageApi.js
export const createRoom = async () => {
  const { data } = await api.post("/video/create-room"); 
  return data;  // { roomId: "..." }
};


// (Optional) Join an existing room
export const joinRoom = async (roomId) => {
  const { data } = await api.post(`/video/join`, { roomId });
  return data; // ✅ adjust depending on backend response
};
