// src/controllers/upload.controller.js

import {
  uploadCloudinary,
  updateCloudinary,
  deleteCloudinary,
} from "../../database/cloudinary/cloudinary.js";

/**
 * Format uploaded file response
 */
const formatFileResponse = (file, cloudinaryResult) => {
  return {
    originalName: file.originalname,
    mimetype: file.mimetype,
    size: file.size,

    url: cloudinaryResult.secureUrl,
    publicId: cloudinaryResult.publicId,
    resourceType: cloudinaryResult.resourceType,
    format: cloudinaryResult.format,
    bytes: cloudinaryResult.bytes,
  };
};

/**
 * =========================================================
 * @desc Upload Single File
 * @route POST /api/upload/single
 * =========================================================
 */
export const uploadSingleFile = async (req, res, next) => {
  try {
    if (!req.file) {
         
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await uploadCloudinary(req.file.buffer, {
        mimetype: req.file.mimetype,
      });
      // console.log(req.file);
      // console.log(req.file.buffer);
      // console.log(req.file.mimetype);
      // console.log(result);
      

    return res.status(201).json({
      success: true,

      data: formatFileResponse(req.file, result),

      message: "File uploaded successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================================================
 * @desc Upload Multiple Files
 * @route POST /api/upload/multiple
 * =========================================================
 */
export const uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.uploadedFiles?.length) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadedFiles = [];

    for (const file of req.uploadedFiles) {
      const result = await uploadCloudinary(file.buffer, {
        mimetype: file.mimetype,
      });

      uploadedFiles.push(
        formatFileResponse(file, result)
      );
    }

    return res.status(201).json({
      success: true,

      count: uploadedFiles.length,

      data: uploadedFiles,

      message: `${uploadedFiles.length} files uploaded successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================================================
 * @desc Update Existing File
 * @route PUT /api/upload/update/:publicId
 * =========================================================
 */
export const updateFile = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

      const result = await updateCloudinary(req.file.buffer, {
      publicId,
      mimetype: req.file.mimetype,
    });

    return res.status(200).json({
      success: true,

      data: formatFileResponse(req.file, result),

      message: "File updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================================================
 * @desc Delete File
 * @route DELETE /api/upload/:publicId
 * =========================================================
 */
export const deleteFile = async (req, res, next) => {
  try {
    const { publicId, resourceType } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      });
    }

    await deleteCloudinary(
      publicId,
      resourceType || "image"
    );

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * =========================================================
 * @desc Inline PDF Preview
 * @route GET /api/upload/inline-pdf
 * =========================================================
 */
export const inlinePDF = async (req, res) => {
  try {
    const { url } = req.query;

    // console.log(url,"url");
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: "PDF URL is required",
      });
    }

    return res.redirect(url);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "PDF preview failed",
    });
  }
};