// src/redux/chat/chatSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createOrGetConversationThunk,
  getMyConversationsThunk,
  sendMessageThunk,
  getConversationMessagesThunk,
  getAllUsersForChatThunk,
} from "./chatTunk.js";

const initialState = {
  conversations: [],      // WhatsApp left sidebar
  currentConversation: null,
  messages: [],           // messages of open chat
  chatUsers: [],          // all users for new chat
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
      state.messages = []; // clear old messages
    },

    addMessageRealtime: (state, action) => {
      // socket.io incoming message
      state.messages.push(action.payload);

      // update last message in sidebar
      const convo = state.conversations.find(
        (c) => c._id === action.payload.conversationId
      );
      if (convo) convo.lastMessage = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------------- CREATE / OPEN CONVERSATION ---------------- */
      .addCase(createOrGetConversationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrGetConversationThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload.data;

        // add to sidebar if not exists
        const exists = state.conversations.find(
          (c) => c._id === action.payload.data._id
        );
        if (!exists) {
          state.conversations.unshift(action.payload.data);
        }
      })
      .addCase(createOrGetConversationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- MY CONVERSATIONS ---------------- */
      .addCase(getMyConversationsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyConversationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.data;
      })
      .addCase(getMyConversationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- GET MESSAGES ---------------- */
      .addCase(getConversationMessagesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getConversationMessagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.data;
      })
      .addCase(getConversationMessagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- SEND MESSAGE ---------------- */
      .addCase(sendMessageThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload.data);

        // update sidebar last message
        const convo = state.conversations.find(
          (c) => c._id === action.payload.data.conversationId
        );
        if (convo) convo.lastMessage = action.payload.data;
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- CHAT USERS ---------------- */
      .addCase(getAllUsersForChatThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsersForChatThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.chatUsers = action.payload.data;
      })
      .addCase(getAllUsersForChatThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentConversation,
  addMessageRealtime,
} = chatSlice.actions;

export default chatSlice.reducer;
