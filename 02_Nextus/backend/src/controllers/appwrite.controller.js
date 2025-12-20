import fs from "fs";
import { Client, Storage, Databases, Query } from "node-appwrite";

// Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const storage = new Storage(client);
const databases = new Databases(client);

const BUCKET_ID = process.env.STORAGE_BUCKET_ID;
const DATABASE_ID = process.env.DATABASE_ID;

// ---------------------
// Upload Document
// ---------------------
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { path: filePath, originalname, mimetype } = req.file;
    const userId = req.user.$id;

    // Read file as buffer (safe for Windows paths)
    const fileBuffer = fs.readFileSync(filePath);

    // Upload to Appwrite Storage
 const uploadedFile = await storage.createFile(
  BUCKET_ID,
  "unique()",
  fileBuffer,
  req.file.mimetype,
  ["role:all"], // read
  ["role:all"]  // write
);

    // Store metadata in database
    const doc = await databases.createDocument(DATABASE_ID, "unique()", {
      name: originalname,
      uploadedBy: userId,
      versions: JSON.stringify([
        {
          fileId: uploadedFile.$id,
          fileName: originalname,
          uploadedAt: new Date().toISOString(),
          status: "Pending",
        },
      ]),
    });

    // Delete local temp file
    fs.unlinkSync(filePath);

    res.status(201).json({ message: "File uploaded successfully", document: doc });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ---------------------
// List User Documents
// ---------------------
export const listDocuments = async (req, res) => {
  try {
    const docs = await databases.listDocuments(DATABASE_ID, [
      Query.equal("uploadedBy", req.user.$id),
    ]);
    res.json(docs.documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---------------------
// Download / Preview Document
// ---------------------
export const downloadDocument = async (req, res) => {
  try {
    const fileId = req.params.id;
    const fileStream = await storage.getFileDownload(BUCKET_ID, fileId);
    fileStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---------------------
// Add Signature
// ---------------------
export const addSignature = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No signature uploaded" });

    const { path: filePath, mimetype } = req.file;
    const docId = req.params.id;
    const userId = req.user.$id;

    const signatureBuffer = fs.readFileSync(filePath);

    const uploadedSignature = await storage.createFile(
      BUCKET_ID,
      "unique()",
      signatureBuffer,
      mimetype
    );

    const doc = await databases.getDocument(DATABASE_ID, docId);
    const versions = JSON.parse(doc.versions);

    versions.push({
      signer: userId,
      fileId: uploadedSignature.$id,
      uploadedAt: new Date().toISOString(),
      type: "signature",
    });

    await databases.updateDocument(DATABASE_ID, docId, { versions: JSON.stringify(versions) });

    fs.unlinkSync(filePath);

    res.json({ message: "Signature added successfully", document: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
