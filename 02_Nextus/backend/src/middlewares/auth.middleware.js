import { getUserFromCookies } from "../lib/getUserFromCookies.js";

/**
 * Protect routes: attach req.user if authenticated
 */
export async function protect(req, res, next) {
  try {
    const user = await getUserFromCookies(req);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error("🔥 Auth middleware error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

// -------------------- Authorize by role --------------------
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};