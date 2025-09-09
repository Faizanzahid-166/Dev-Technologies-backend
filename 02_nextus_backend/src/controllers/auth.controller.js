import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper to sign token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// REGISTER
export const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Incoming body:", req.body);

    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken(user);

    const { password: pwd, ...userWithoutPassword } = user.toObject();

    res.status(201).json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
});

// LOGIN
export const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user);

    const { password: pwd, ...userWithoutPassword } = user.toObject();

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
});

// LOGOUT
export const logoutUser = asyncHandler(async (req, res, next) => {
  try {
    res.json({
      msg: "Logged out successfully. Please remove token on client side.",
    });
  } catch (error) {
    next(error);
  }
});
