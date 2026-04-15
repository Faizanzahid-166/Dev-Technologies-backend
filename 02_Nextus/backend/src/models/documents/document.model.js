import mongoose from "mongoose";

/**
 * Version schema (each upload = new version)
 */
const versionSchema = new mongoose.Schema(
  {
    version: {
      type: Number, required: true,
    },

    fileUrl: {
      type: String, required: true,
    },

    publicId: {
      type: String,required: true,
    },

    fileMime: {
      type: String, required: true, enum: ["application/pdf"],
    },

    fileSize: {
      type: Number, required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,
    },

    notes: { type: String, trim: true,
    },
  },
  { timestamps: true }
);

/**
 * Signature schema
 */
const signatureSchema = new mongoose.Schema(
  {
    signer: {
      type: mongoose.Schema.Types.ObjectId,   ref: "User", required: true,
    },

    imageUrl: {
      type: String,required: true,
    },
  },
  { timestamps: true }
);

/**
 * Main document schema
 */
const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,  required: true, trim: true,
    },

    description: {
      type: String,   trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Signed", "Archived"],
      default: "Pending",
    },

    currentVersion: {
      type: Number,
      default: 1,
    },

    versions: {
      type: [versionSchema],
      default: [],
    },

    signatures: {
      type: [signatureSchema],
      default: [],
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes (important for production)
 */
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ createdAt: -1 });

export default mongoose.model("Document", documentSchema);
