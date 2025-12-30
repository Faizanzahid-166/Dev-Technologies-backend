import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { 
  hashPassword, 
  comparePassword, 
  signToken, 
  generateOTP, 
  getAuthCookieHeader,
  clearAuthCookieHeader
} from '../lib/auth.js';
import {getUserFromCookies} from '../lib/getUserFromCookies.js'
import { sendVerificationEmail } from '../services/mail.service.js';
import { ApiSuccess, ApiError } from '../utils/apiResponse.js';
import { signupSchema, loginSchema } from '../utils/validators.js';

/// -------------------- SIGNUP with OTP --------------------
export const registerUser = asyncHandler(async (req, res) => {
  // Validate request
  const parsed = signupSchema.safeParse(req.body);
  console.log("body",req.body)
  if (!parsed.success) {
    const errors = parsed.error.errors.map(e => e.message);
    throw new ApiError(400, "Invalid signup data", errors);
  }

  const { name, email, password, customerType } = parsed.data;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) throw new ApiError(400, "User already exists");

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Generate OTP
  const otpObj = generateOTP(); // { code, expiresAt }

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    customerType,
    role: "customer",
    otp: otpObj,
    emailVerified: false
  });
  console.log("user => fn",user)

  // Send OTP email via Resend
 try {
  const emailResult = await sendVerificationEmail(email, name, otpObj.code);
  console.log("OTP email result:",sendVerificationEmail, emailResult); // logs { success: true/false, message: "..." }
} catch (err) {
  console.error("Failed to send verification email:", err);
}


  // Respond (DO NOT expose OTP in production!)
  res.status(201).json(
    new ApiSuccess(
      201,
      { user: { id: user._id, email: user.email } },
      "User registered. Verify OTP via email."
    )
  );
});

/// -------------------- VERIFY OTP --------------------
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new ApiError(400, "Email and OTP are required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  if (!user.otp || user.otp.code !== otp)
    throw new ApiError(400, "Invalid OTP");

  if (user.otp.expiresAt < new Date())
    throw new ApiError(400, "OTP expired");

  // Mark verified and clear OTP
  user.emailVerified = true;
  user.otp = null;
  await user.save();

  // Generate JWT
  const token = signToken({ id: user._id, role: user.role });
  const cookieHeader = getAuthCookieHeader(token);
  res.setHeader("Set-Cookie", cookieHeader);

  const { password, ...userWithoutPassword } = user.toObject();

  res.status(200).json(
    new ApiSuccess(200, { user: userWithoutPassword, token }, "OTP verified. Account activated.")
  );
});

/// -------------------- RESEND OTP --------------------
export const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  if (user.emailVerified)
    throw new ApiError(400, "User already verified");

  // OPTIONAL: Rate-limit resend (example: 1 per 60 seconds)
  if (user.otp && user.otp.lastSentAt && (Date.now() - user.otp.lastSentAt.getTime() < 60_000)) {
    throw new ApiError(429, "Please wait before requesting another OTP");
  }

  // Generate new OTP
  const otpObj = generateOTP();
  otpObj.lastSentAt = new Date();
  user.otp = otpObj;
  await user.save();

  // Send OTP email
  try {
    await sendVerificationEmail(email, user.name, otpObj.code);
  } catch (err) {
    console.error("Failed to resend verification email:", err);
  }

  // Respond (DO NOT expose OTP in production)
  res.status(200).json(
    new ApiSuccess(200, {}, "New OTP sent to your email")
  );
});

// -------------------- LOGIN --------------------
export const loginUser = asyncHandler(async (req, res) => {
  // Validate request
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, "Invalid login data", parsed.error.errors);

  const { email, password } = parsed.data;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(400, "Invalid credentials");

  const match = await comparePassword(password, user.password);
  if (!match) throw new ApiError(400, "Invalid credentials");

  const token = signToken({ id: user._id, role: user.role });
  const cookieHeader = getAuthCookieHeader(token);
  res.setHeader("Set-Cookie", cookieHeader);

  const { password: pwd, ...userWithoutPassword } = user.toObject();
  res.json(new ApiSuccess(200, { user: userWithoutPassword, token }, "Login successful"));
});

// -------------------- LOGOUT --------------------
export const logoutUser = asyncHandler(async (req, res) => {
  const cookieHeader = clearAuthCookieHeader();
  res.setHeader("Set-Cookie", cookieHeader);
  res.json(new ApiSuccess(200, null, "Logged out successfully"));
});

// -------------------- GET CURRENT USER --------------------
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getUserFromCookies(req);
  if (!user) throw new ApiError(401, "Unauthorized");

  const { password: pwd, ...userWithoutPassword } = user.toObject();
  res.json(new ApiSuccess(200, { user: userWithoutPassword }, "Current user fetched"));
});
