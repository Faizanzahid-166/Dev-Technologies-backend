// src/redux/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import socket from "../../scoket/scoket.js";
import {
  loginApi,
  registerApi,
  verifyOtpApi,
  resendOtpApi,
  logoutApi,
  getCurrentUserApi,
} from "../../api/authCollection.js";

/* ---------------- LOGIN ---------------- */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginApi(data);
      console.log(res)
        const userId = res.data.user._id; // ✅ CORRECT PATH

      // connect socket AFTER login
      socket.connect();
      socket.emit("userOnline", userId);
      return res
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ---------------- REGISTER ---------------- */
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      return await registerApi(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
/* ---------------- VERIFY OTP ---------------- */
export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await verifyOtpApi(data);
      return res; // <-- res should have { user, token, message } 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ---------------- RESEND OTP ---------------- */
export const resendOtpThunk = createAsyncThunk(
  "auth/resendOTP",
  async (data, { rejectWithValue }) => {
    try {
      // Ensure email is defined
      if (!data?.email) throw new Error("Email is required to resend OTP");

      const res = await resendOtpApi(data);

      // Make sure we always return a consistent object
      return {
        success: res.success ?? true,
        message: res.message ?? "OTP resent successfully",
      };
    } catch (err) {
      // Extract backend error messages safely
      return rejectWithValue(err.response?.data?.message || err.message || "Server error");
    }
  }
);

/* ---------------- LOGOUT ---------------- */
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await logoutApi();
       // ✅ stop realtime connection
      socket.disconnect();
      return res
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ---------------- CURRENT USER ---------------- */
export const getCurrentUserThunk = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentUserApi();
    } catch {
      return rejectWithValue(null);
    }
  }
);
