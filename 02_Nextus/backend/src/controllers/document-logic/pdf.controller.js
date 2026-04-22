import PDF from "../models/PDF.js";
import { cloudinary } from "../database/cloudinary.js";

/**
 * Cloudinary raw uploads are served with Content-Disposition: attachment by default,
 * which forces a download instead of an inline browser preview.
 *
 * We rewrite the delivery URL to add the `fl_attachment:false` transformation flag,
 * which tells Cloudinary to send Content-Disposition: inline — allowing <iframe> preview.
 *
 * Original:  https://res.cloudinary.com/<cloud>/raw/upload/<public_id>
 * Rewritten: https://res.cloudinary.com/<cloud>/raw/upload/fl_attachment:false/<public_id>
 */
const toInlineUrl = (rawUrl) => {
  // Insert the flag right after /upload/
  return rawUrl.replace("/upload/", "/upload/fl_attachment:false/");
};
 
// @desc    Upload a PDF file
// @route   POST /api/pdfs/upload
export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }
 
    const { originalname, path: rawUrl, filename: publicId, size } = req.file;
 
    // Use the inline-flagged URL for preview; Cloudinary serves it without forcing a download
    const url = toInlineUrl(rawUrl);
 
    const pdf = await PDF.create({
      originalName: originalname,
      url,
      publicId,
      size,
    });
 
    res.status(201).json({
      success: true,
      message: "PDF uploaded successfully.",
      data: pdf,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error during upload." });
  }
};
 
// @desc    Get all uploaded PDFs
// @route   GET /api/pdfs
export const getAllPDFs = async (req, res) => {
  try {
    const pdfs = await PDF.find().sort({ uploadedAt: -1 });
    res.status(200).json({ success: true, count: pdfs.length, data: pdfs });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve PDFs." });
  }
};
 
// @desc    Get a single PDF by ID
// @route   GET /api/pdfs/:id
export const getPDFById = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ success: false, message: "PDF not found." });
    }
    res.status(200).json({ success: true, data: pdf });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve PDF." });
  }
};

// @desc    Proxy-download a PDF with the correct filename and Content-Type.
//          Cloudinary raw files download as unnamed application/octet-stream.
//          This route fetches the file server-side and re-serves it properly.
// @route   GET /api/pdfs/:id/download
export const downloadPDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ success: false, message: "PDF not found." });
    }
 
    const response = await fetch(pdf.url);
    if (!response.ok) {
      return res.status(502).json({ success: false, message: "Failed to fetch file from storage." });
    }
 
    // Ensure .pdf extension
    const filename = pdf.originalName.endsWith(".pdf")
      ? pdf.originalName
      : `${pdf.originalName}.pdf`;
 
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(filename)}"`
    );
 
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ success: false, message: "Download failed." });
  }
};
 
// @desc    Delete a PDF by ID
// @route   DELETE /api/pdfs/:id
export const deletePDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ success: false, message: "PDF not found." });
    }
 
    // Remove from Cloudinary
    await cloudinary.uploader.destroy(pdf.publicId, { resource_type: "raw" });
 
    // Remove from DB
    await PDF.findByIdAndDelete(req.params.id);
 
    res.status(200).json({ success: true, message: "PDF deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Failed to delete PDF." });
  }
};
 

// @desc    Open a PDF inline in a new browser tab.
//          Same proxy as download but with Content-Disposition: inline.
// @route   GET /api/pdfs/:id/inline
export const inlinePDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ success: false, message: "PDF not found." });
    }
 
    const response = await fetch(pdf.url);
    if (!response.ok) {
      return res.status(502).json({ success: false, message: "Failed to fetch file from storage." });
    }
 
    const filename = pdf.originalName.endsWith(".pdf")
      ? pdf.originalName
      : `${pdf.originalName}.pdf`;
 
    res.setHeader("Content-Type", "application/pdf");
    // inline = browser renders it; attachment = browser downloads it
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(filename)}"`
    );
 
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Inline error:", error);
    res.status(500).json({ success: false, message: "Failed to open PDF." });
  }
};