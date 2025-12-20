import generateToken from "../utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { fullname, email, username, password } = req.body;
    console.log("BODY:", req.body);

    // Validation
    if (!fullname || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("something very wrong in authregister", err);
  }
};
export const loginUser = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body); // 👈 Add this to confirm req.body is parsed
    console.log("BODY TYPE:", typeof req.body);
    console.log("Headers:", req.headers);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    
    

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
         token, // 👈 send token here
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
  } catch (err) {
    console.error("❌ loginUser Error:", err); // 👈 Log the full error
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};

