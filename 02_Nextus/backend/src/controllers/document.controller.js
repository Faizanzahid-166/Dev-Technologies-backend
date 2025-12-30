import Document from "../models/document.model.js";
import { uploadCloudinary } from "../database/cloudinary/cloudinary.js";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const localPath = req.file.path;

    // 1️⃣ Upload to Cloudinary
    const cloudRes = await uploadCloudinary(localPath, req.file.mimetype);

    // 2️⃣ Store metadata in MongoDB
    const doc = await Document.create({
      name: req.file.originalname,
      currentVersion: 1,
      status: "Pending",
      versions: [
        {
          fileUrl: cloudRes.secure_url,      // Cloudinary URL
          fileMime: req.file.mimetype,
          fileSize: req.file.size,
          localPath: localPath,              // corrected variable name
          cloudPublicId: cloudRes.public_id,
          uploadedBy: req.user._id,
        },
      ],
      uploadedBy: req.user._id,
    });

    res.status(201).json({ 
      message: "File uploaded locally & to Cloudinary", 
      document: doc 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// List User Documents
export const listDocuments = async (req, res) => {
  const docs = await Document.find({ uploadedBy: req.user._id });
  res.json(docs);
};

// Download Document (return Cloudinary URL)
export const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const latestVersion = doc.versions[doc.versions.length - 1];

    res.json({ fileUrl: latestVersion.fileUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Add E-signature
export const addSignature = async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Document not found" });
  if (!req.file) return res.status(400).json({ message: "No signature uploaded" });

  doc.signatures.push({
    signer: req.user._id,
    imageUrl: req.file.path, // Cloudinary URL
  });

  await doc.save();
  res.json({ message: "Signature added", document: doc });
};
