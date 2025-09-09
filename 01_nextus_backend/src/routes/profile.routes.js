import express from "express";
import {  updateProfile, listUsers} from "../controllers/profile.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protected routes
router.put("/me", protect, updateProfile);

// NEW: list all users
router.get("/users", protect , listUsers);

export default router;
