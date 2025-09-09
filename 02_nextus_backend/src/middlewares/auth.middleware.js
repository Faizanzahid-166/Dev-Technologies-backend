import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")

    
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // fetch user so req.user has full object with _id
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (err) {
      console.error("Auth error:", err);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Role-based access
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role.toLowerCase())) {
      console.log("User role:", req.user.role);

      return res.status(401).json({ message: "Not authorized" });
    }
    next();
  };
};


// Protect Socket connections
export const verifySocketJWT = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) return next(new Error("Not authorized: no token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id name email role");

    if (!user) return next(new Error("User not found"));

    // Attach normalized user to socket
    socket.user = {
      id: user._id.toString(), // always string
      name: user.name || "Unknown",
      role: user.role || "user",
    };

    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    next(new Error("Not authorized: invalid token"));
  }
};
