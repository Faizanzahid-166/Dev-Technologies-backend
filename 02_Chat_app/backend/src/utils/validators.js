//utils/valitors.js
import { z } from "zod";

// Signup validation
export const signupSchema = z.object({
  name: z.string().min(2, "Name is required").max(50, "Name must be less than 50 characters").transform(s => s.trim()),
  email: z.string().email("Invalid email"),
  password: z.string().min(6).regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Password must contain letters and numbers"),
  customerType: z.string().max(50, "Type must be less than 50 characters").optional()
});

// Login validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

