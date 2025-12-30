import { serialize, parse } from "cookie";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Set a JWT token in an HTTP-only cookie
 * @param {string} token
 * @returns {string} serialized cookie header
 */
function setTokenCookie(token) {
  return serialize("token", token, {
    httpOnly: true,        // prevents JS access
    secure: isProduction,  // HTTPS only in production
    sameSite: "lax",       // CSRF protection
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear the token cookie
 * @returns {string} serialized cookie header
 */
function clearTokenCookie() {
  return serialize("token", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Parse cookies from request header
 * @param {string} cookieHeader
 * @returns {Object} parsed cookies
 */
function parseCookies(cookieHeader = "") {
  return parse(cookieHeader);
}

export { setTokenCookie, clearTokenCookie, parseCookies };
