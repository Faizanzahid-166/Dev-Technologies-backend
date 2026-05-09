import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSliceTunk/authSlice.js';
import userReducer from './userSliceTunk/userSice.js';
import dependenciesReducer from './dependenciesSliceTunk/dependenciesSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    dependencies: dependenciesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;