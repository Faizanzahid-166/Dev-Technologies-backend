import User from "../models/user.model.js";
import { verifyToken } from "./auth.js";
import cookie from "cookie";

/**
 * Get the logged-in user from cookies in Express
 * @param {import('express').Request} req
 * @returns {Promise<User|null>} Mongoose user or null
 */
export async function getUserFromCookies(req) {
  try {
    if (!req?.headers?.cookie) return null;

    const cookies = cookie.parse(req.headers.cookie);
    const token = cookies.token;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.id) return null;

    const user = await User.findById(payload.id);
    return user || null;

  } catch (err) {
    console.error("🔥 [Auth] getUserFromCookies error:", err);
    return null;
  }
}
