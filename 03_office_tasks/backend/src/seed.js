/**
 * TaskFlow Seed Script
 * Creates demo admin, employees, and sample tasks
 * Run: node seed.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// ---- Inline models (avoid circular imports) ----
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'completed', 'not_completed'], default: 'pending' },
    reason: { type: String, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

const seed = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected\n');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('🗑️  Cleared existing data\n');

    // Hash password helper
    const hash = (pw) => bcrypt.hash(pw, 12);

    // Create admin
    const admin = await User.create({
      name: 'Sarah Johnson',
      email: 'admin@taskflow.com',
      password: await hash('admin123'),
      role: 'admin',
    });

    // Create employees
    const employees = await User.create([
      { name: 'Alex Martinez', email: 'alex@taskflow.com', password: await hash('emp12345'), role: 'employee' },
      { name: 'Priya Sharma', email: 'priya@taskflow.com', password: await hash('emp12345'), role: 'employee' },
      { name: 'James Wilson', email: 'james@taskflow.com', password: await hash('emp12345'), role: 'employee' },
      // Default demo employee
      { name: 'Demo Employee', email: 'emp@taskflow.com', password: await hash('emp12345'), role: 'employee' },
    ]);

    console.log('👥 Created users:');
    console.log(`   Admin   → admin@taskflow.com / admin123`);
    employees.forEach((e) => console.log(`   Employee → ${e.email} / emp12345`));
    console.log();

    // Sample tasks
    const taskTemplates = [
      {
        title: 'Prepare Q4 Financial Report',
        description: 'Compile all quarterly data, revenue analysis, and projections for Q4 board presentation. Include YoY comparison.',
        status: 'completed',
        reason: null,
      },
      {
        title: 'Update Client Database',
        description: 'Review and update all client contact information in the CRM system. Remove duplicates and ensure all records are complete.',
        status: 'pending',
        reason: null,
      },
      {
        title: 'Fix Login Page Bug',
        description: 'Users are reporting that the "Remember me" checkbox on the login page is not working properly after the latest deployment.',
        status: 'not_completed',
        reason: 'Technical problem',
      },
      {
        title: 'Design New Marketing Materials',
        description: 'Create updated brochures and digital assets for the upcoming product launch campaign. Follow the new brand guidelines.',
        status: 'pending',
        reason: null,
      },
      {
        title: 'Conduct Team Performance Reviews',
        description: 'Complete mid-year performance reviews for all team members. Submit completed forms to HR by end of week.',
        status: 'not_completed',
        reason: 'Waiting for approval',
      },
      {
        title: 'Migrate Legacy Data',
        description: 'Transfer all legacy customer data from the old system to the new cloud platform. Validate data integrity post-migration.',
        status: 'pending',
        reason: null,
      },
      {
        title: 'Write API Documentation',
        description: 'Document all REST API endpoints for the new payment integration module. Include request/response examples and error codes.',
        status: 'completed',
        reason: null,
      },
      {
        title: 'Organize Office Supply Inventory',
        description: 'Count and catalog all office supplies. Place orders for items running low. Update the inventory spreadsheet.',
        status: 'not_completed',
        reason: 'Time was not enough',
      },
      {
        title: 'Set Up CI/CD Pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment to staging and production environments.',
        status: 'pending',
        reason: null,
      },
      {
        title: 'Client Onboarding Presentation',
        description: 'Prepare a 20-minute onboarding presentation for the new enterprise client starting next Monday.',
        status: 'completed',
        reason: null,
      },
    ];

    const tasks = [];
    taskTemplates.forEach((template, i) => {
      const assignedTo = employees[i % employees.length];
      tasks.push({
        ...template,
        assignedTo: assignedTo._id,
        assignedBy: admin._id,
      });
    });

    await Task.insertMany(tasks);
    console.log(`📋 Created ${tasks.length} sample tasks\n`);

    console.log('✅ Seed complete! Start the server and login with:');
    console.log('   Admin    → admin@taskflow.com / admin123');
    console.log('   Employee → emp@taskflow.com   / emp12345\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
