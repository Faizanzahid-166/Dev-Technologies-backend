//lib/auth.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setTokenCookie, clearTokenCookie } from "./cookie.js";

/* -------------------- ENV -------------------- */
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const OTP_EXPIRES_MIN = Number(process.env.OTP_EXPIRES_MIN || 10);

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

/* -------------------- Password -------------------- */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

/* -------------------- JWT -------------------- */
export function signToken(payload) {
  // Convert _id or id to string for safety
  const safePayload = { ...payload };
  if (safePayload._id) safePayload._id = safePayload._id.toString();
  if (safePayload.id) safePayload.id = safePayload.id.toString();

  return jwt.sign(safePayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null; // invalid or expired token
  }
}

/* -------------------- OTP -------------------- */
export function generateOTP(length = 6) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }

  const expiresAt = new Date(Date.now() + OTP_EXPIRES_MIN * 60 * 1000);
  return { code, expiresAt };
}

/* -------------------- Cookies -------------------- */
export function getAuthCookieHeader(token) {
  return setTokenCookie(token);
}

export function clearAuthCookieHeader() {
  return clearTokenCookie();
}
