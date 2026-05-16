import { getUserFromCookies } from "../lib/getUserFromCookies.js";

/**
 * Protect routes: attach req.user if authenticated
 */
export async function protect(req, res, next) {
  try {
    const user = await getUserFromCookies(req);
    // console.log("COOKIES:", req.cookies);
    // console.log("HEADERS:", req.headers);

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

// Middleware: require admin role
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
  }
  next();
};
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


// Pro Tip (important for your project)

// You are building a serious MERN backend, so always follow:

// 👉 Middleware = auth
// 👉 Controller = business logic