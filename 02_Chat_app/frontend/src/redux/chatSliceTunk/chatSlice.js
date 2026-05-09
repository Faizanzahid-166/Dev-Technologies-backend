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
  conversations: [],       // WhatsApp left sidebar
  currentConversation: null,
  messages: [],            // messages of open chat
  chatUsers: [],           // all users for new chat
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

    // 🔥 socket.io incoming message
   addMessageRealtime: (state, action) => {
  const message = action.payload;

  const isCurrentChat =
    state.currentConversation?._id === message.conversationId;

  // ✅ only show message if chat is open
  if (isCurrentChat) {
    state.messages.push(message);
  }

  // update sidebar last message ALWAYS
  const convo = state.conversations.find(
    (c) => c._id === message.conversationId
  );

  if (convo) {
    convo.lastMessage = message;
  }
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
        state.currentConversation = action.payload;

        const exists = state.conversations.find(
          (c) => c._id === action.payload._id
        );

        if (!exists) {
          state.conversations.unshift(action.payload);
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
        state.conversations = action.payload;
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
        state.messages = action.payload;
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

        const message = action.payload;
        state.messages.push(message);

        const convo = state.conversations.find(
          (c) => c._id === message.conversationId
        );
        if (convo) {
          convo.lastMessage = message;
        }
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
        state.chatUsers = action.payload;
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
