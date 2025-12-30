import User from "../models/user.model.js"; // Adjust path for your project
import bcrypt from "bcryptjs";

/**
 * Create a root admin user if not already present
 */
export async function createRootAdmin() {
  const rootEmail = process.env.DEFAULT_ADMIN_EMAIL;
  const rootPassword = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!rootEmail || !rootPassword) {
    console.warn("⚠️ DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD not set in environment variables");
    return;
  }

  try {
    // Check if root admin already exists
    const existingAdmin = await User.findOne({ email: rootEmail });

    if (existingAdmin) {
      console.log("ℹ️ Root admin already exists:", rootEmail);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(rootPassword, 10);

    // Create new root admin
    await User.create({
      name: "Root Admin",
      email: rootEmail,
      password: hashedPassword,
      role: "admin",
      isRoot: true,
      emailVerified: true,
    });

    console.log("✅ Root admin created:", rootEmail);

  } catch (err) {
    console.error("🔥 Error creating root admin:", err);
  }
}
