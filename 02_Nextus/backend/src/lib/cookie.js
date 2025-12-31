import { serialize, parse } from "cookie";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Set a JWT token in an HTTP-only cookie
 * @param {string} token
 */
function setTokenCookie(token) {
  return serialize("token", token, {
    httpOnly: true,        
    secure: isProduction,       // HTTPS only in production
    sameSite: isProduction ? "none" : "lax", // cross-site cookies in production
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear the token cookie
 */
function clearTokenCookie() {
  return serialize("token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax", // cross-site in production
    path: "/",
    maxAge: 0,
  });
}

/**
 * Parse cookies from request header
 */
function parseCookies(cookieHeader = "") {
  return parse(cookieHeader);
}

export { setTokenCookie, clearTokenCookie, parseCookies };
