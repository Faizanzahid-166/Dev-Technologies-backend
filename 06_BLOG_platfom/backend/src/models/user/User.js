import  mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const qualificationSchema = new mongoose.Schema({
  degreeType: { type: String, trim: true },
  category: { type: String, trim: true },
  specialization: { type: String, trim: true },
  institution: { type: String, trim: true },
  yearOfCompletion: { type: String, trim: true },
  grade: { type: String, trim: true, default: '' },
}, { _id: true });

const adminSchema = new mongoose.Schema(
  {
    // ── Core Auth ─────────────────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },

    // ── Personal Information ──────────────────────────────────────────────────
    fatherName: { type: String, trim: true, maxlength: 100, default: '' },
    mobileNumber: { type: String, trim: true, maxlength: 20, default: '' },
    whatsappNumber: { type: String, trim: true, maxlength: 20, default: '' },
    cnic: { type: String, trim: true, maxlength: 15, default: '' },
    dateOfBirth: { type: Date, default: null },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Transgender'],
      default: 'Male',
    },
    religion: { type: String, trim: true, default: '' },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Divorced', 'Widowed'],
      default: 'Single',
    },
    disabilityStatus: {
      type: String,
      enum: ['Yes', 'No'],
      default: 'No',
    },

    // ── Address ───────────────────────────────────────────────────────────────
    domicileProvince: { type: String, trim: true, default: '' },
    domicileDistrict: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    permanentAddress: { type: String, trim: true, maxlength: 500, default: '' },
    postalAddress: { type: String, trim: true, maxlength: 500, default: '' },

    // ── Education ─────────────────────────────────────────────────────────────
    qualifications: {
      type: [qualificationSchema],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 15,
        message: 'Cannot exceed 15 qualifications',
      },
    },

    // ── Existing fields ───────────────────────────────────────────────────────
    bio: { type: String, trim: true, maxlength: 500, default: '' },
    skills: {
      type: [String],
      default: [],
      validate: { validator: (arr) => arr.length <= 20, message: 'Max 20 skills' },
    },
    profileImage: { type: String, default: '' },
    role: { type: String, enum: ['admin'], default: 'admin' },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before saving
adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get safe profile
adminSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

 export default mongoose.model('Admin', adminSchema);