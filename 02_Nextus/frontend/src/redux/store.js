// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSliceTunk/authSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
