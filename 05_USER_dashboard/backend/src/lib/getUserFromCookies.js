import User from "../models/User.js";
import { verifyToken } from "./auth.js";

/**
 * Get the logged-in user from cookies in Express
 * @param {import('express').Request} req
 * @returns {Promise<User|null>}
 */
export async function getUserFromCookies(req) {
  try {
    const cookies = req.cookies || {};

    const token = cookies.token; // ✅ ONLY ONE

    if (!token) return null;

    const payload = verifyToken(token);

  //  console.log("DECODED PAYLOAD:", payload); // 🔥 DEBUG

    if (!payload?.id) return null;

    return await User.findById(payload.id);

  } catch (err) {
    console.error(err);
    return null;
  }
}