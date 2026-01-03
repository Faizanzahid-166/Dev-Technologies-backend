// src/redux/chat/chatThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import socket from "../../scoket/scoket.js";

import {
  createOrGetConversationApi,
  getMyConversationsApi,
  sendMessageApi,
  getConversationMessagesApi,
  getAllUsersForChatApi,
} from "../../api/chatCollection.js";

/* ---------------- CONVERSATION ---------------- */
export const createOrGetConversationThunk = createAsyncThunk(
  "chat/createOrGetConversation",
  async (receiverId, { rejectWithValue }) => {
    try {
      return await createOrGetConversationApi(receiverId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ---------------- MY CONVERSATIONS ---------------- */
export const getMyConversationsThunk = createAsyncThunk(
  "chat/getMyConversations",
  async (_, { rejectWithValue }) => {
    try {
      return await getMyConversationsApi();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ---------------- SEND MESSAGE ---------------- */
export const sendMessageThunk = createAsyncThunk(
  "chat/sendMessage",
  async ({ conversationId, text }, { rejectWithValue }) => {
    try {
      const res = await sendMessageApi({ conversationId, text });

      // 🔥 emit socket message after success
      socket.emit("sendMessage", res.data);

      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ---------------- GET MESSAGES ---------------- */
export const getConversationMessagesThunk = createAsyncThunk(
  "chat/getMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      return await getConversationMessagesApi(conversationId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ---------------- CHAT USERS ---------------- */
export const getAllUsersForChatThunk = createAsyncThunk(
  "chat/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllUsersForChatApi();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
