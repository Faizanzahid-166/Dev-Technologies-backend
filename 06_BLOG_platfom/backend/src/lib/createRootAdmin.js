import User from "../models/user/User.js"; // Adjust path for your project
/**
 * Create a root admin user on first server start if not already present.
 */
export async function createRootAdmin() {
  const rootEmail    = process.env.DEFAULT_ADMIN_EMAIL;
  const rootPassword = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!rootEmail || !rootPassword) {
    console.warn('⚠️  DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD not set — skipping root admin creation');
    return;
  }

  try {
    const existing = await User.findOne({ email: rootEmail });
    if (existing) {
      console.log(`ℹ️  Root admin already exists: ${rootEmail}`);
      return;
    }

    await User.create({
      name: 'Root Admin',
      email: rootEmail,
      password: rootPassword, // hashed by User pre-save hook
      role: 'admin',
      isRoot: true,
      emailVerified: true,
      isActive: true,
    });

    console.log(`✅ Root admin created: ${rootEmail}`);
  } catch (err) {
    console.error('🔥 Error creating root admin:', err.message);
  }
}
