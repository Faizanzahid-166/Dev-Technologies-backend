import Document from "../../models/documents/document.model.js";
import { uploadCloudinary } from "../../database/cloudinary/cloudinary.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiSuccess, ApiError } from "../../utils/apiResponse.js";
import { getUserFromCookies } from "../../lib/getUserFromCookies.js";

export const uploadDocument = asyncHandler(async (req, res) => {
  const user = await getUserFromCookies(req);
  if (!user) throw new ApiError(401, "Unauthorized");

  if (!req.file) throw new ApiError(400, "No file uploaded");

  const cloudinaryResult = await uploadCloudinary(
  req.file.buffer,
  `02_next_us/documents/${user._id}`,
  req.file.mimetype
);
  console.log("Cloudinary Result:", cloudinaryResult);


  const doc = await Document.create({
    name: req.body.title || req.file.originalname,
    uploadedBy: user._id,
    versions: [
      {
        version: 1,
         fileUrl: cloudinaryResult.secureUrl,  // <-- note camelCase
         publicId: cloudinaryResult.publicId,  // <-- note camelCase
        fileMime: req.file.mimetype,
        fileSize: req.file.size,
        uploadedBy: user._id,
        notes: req.body.notes || "",
      },
    ],
  });

  return res.status(201).json(
    new ApiSuccess(201, doc, "Document uploaded successfully")
  );
});



// List User Documents
export const getMyDocuments = asyncHandler(async (req, res) => {
  const user = await getUserFromCookies(req);
  if (!user) throw new ApiError(401, "Unauthorized");

  const documents = await Document.find({ uploadedBy: user._id })
    .select("name status currentVersion versions createdAt")
    .sort({ createdAt: -1 });

  const formattedDocs = documents.map((doc) => {
    const latestVersion = doc.versions.find(
      (v) => v.version === doc.currentVersion
    );

    return {
      id: doc._id,
      name: doc.name,
      status: doc.status,
      version: doc.currentVersion,
      fileUrl: latestVersion?.fileUrl,
      createdAt: doc.createdAt,
    };
  });

  res.json(new ApiSuccess(200, formattedDocs));
});

// docs preview
export const docsPreview = asyncHandler( async (req, res) => {
  const doc = await Document.findById(req.params.documentId);
  if (!doc) return res.status(404).send("Not found");

  const latestVersion = doc.versions.at(-1);
  const pdfUrl = `${latestVersion.fileUrl}.pdf?fl_attachment=false`;

  res.redirect(pdfUrl);
});




// Download Document (return Cloudinary URL)
export const getDocumentById = asyncHandler(async (req, res) => {
  const user = await getUserFromCookies(req);

  const doc = await Document.findOne({
    _id: req.params.id,
    user: user._id
  });

  if (!doc) throw new ApiError(404, "Document not found");

  res.json(new ApiSuccess(200, doc));
});


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
