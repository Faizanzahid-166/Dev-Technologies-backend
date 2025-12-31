import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyOTP,
  resendOTP
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/verifyOTP", verifyOTP);
router.post("/resendOTP", resendOTP);
router.post("/login", loginUser);

// Protected routes
router.get("/getCurrentUser", protect, getCurrentUser);
router.post("/logout", protect, logoutUser);

export default router;
