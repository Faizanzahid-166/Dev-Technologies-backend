import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, verifyOTP } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verifyOTP", verifyOTP);
router.post("/login", loginUser);

router.post("/getCurrentUser",protect, getCurrentUser);
router.post("/logout",protect, logoutUser); // Protected route


export default router;
