// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSliceTunk/authSlice.js';
import chatReducer from './chatSliceTunk/chatSlice.js'

export const store = configureStore({
  reducer: {
    // auth key slice
    auth: authReducer,

    // chat key slice
    chat: chatReducer
  },
});

export default store;
