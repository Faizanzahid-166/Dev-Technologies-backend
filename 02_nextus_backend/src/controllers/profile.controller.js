// controllers/profileController.js

import User from "../models/user.model.js";
import {asyncHandler} from '../utils/asyncHandler.js'

export const updateProfile = asyncHandler(async (req, res) => {
  try {
    const updates = req.body; // body can contain name, role, profile, etc.

    const user = await User.findByIdAndUpdate(
      req.user.id,                 // logged-in user
      { $set: updates },           // apply updates
      { new: true, runValidators: true } // return updated doc + validate enums
    ).select("-password"); // don’t return password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



export const listUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash -password"); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

