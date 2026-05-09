import mongoose from 'mongoose';

export const TASK_REASONS = [
  'Work was not clear',
  'Time was not enough',
  'Technical problem',
  'Waiting for approval',
  'Personal / emergency issue',
];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must be assigned to an employee'],
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'not_completed'],
      default: 'pending',
    },
    reason: {
      type: String,
      enum: [...TASK_REASONS, null, ''],
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Validation: reason required when not_completed
taskSchema.pre('save', async function () {
  if (this.status === 'not_completed' && !this.reason) {
    throw new Error('Reason is required when task is not completed');
  }
  if (this.status !== 'not_completed') {
    this.reason = null;
  }
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
