import mongoose from "mongoose";

const versionSchema = new mongoose.Schema({
  fileUrl: String,
  fileMime: String,
  fileSize: Number,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

const signatureSchema = new mongoose.Schema({
  signer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const documentSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    currentVersion: { type: Number, default: 1 },
    status: { type: String, default: "Pending" },
    versions: [versionSchema],
    signatures: [signatureSchema],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
