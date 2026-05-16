// src/components/admin/UploadBox.jsx

import React, { useRef, useState } from "react";
import { uploadAPI } from "../../api/APIs.js";
import toast from "react-hot-toast";

const MAX_SIZES = {
  image: 10,
  video: 100,
  pdf: 20,
};

const UploadBox = ({
  type = "image",
  label,
  accept,
  onUpload,
  current,
  multiple = false,
}) => {
  const inputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  /**
   * =====================================================
   * Validate File
   * =====================================================
   */
  const validateFile = (file) => {
    if (!file) {
      toast.error("No file selected");
      return false;
    }

    const maxMB = MAX_SIZES[type] || 10;

    if (file.size > maxMB * 1024 * 1024) {
      toast.error(`Max ${maxMB}MB allowed`);
      return false;
    }

    return true;
  };

  /**
   * =====================================================
   * Upload Single File
   * =====================================================
   */
  const uploadSingle = async (file) => {
    try {
      if (!validateFile(file)) return;

      setLoading(true);

      const formData = new FormData();

      // IMPORTANT:
      // backend expects "file"
      formData.append("file", file);

      const res = await uploadAPI.uploadSingle(formData);

      onUpload?.(res.data.data);

      toast.success("File uploaded successfully");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * =====================================================
   * Upload Multiple Files
   * =====================================================
   */
  const uploadMultiple = async (files) => {
    try {
      if (!files?.length) return;

      const invalid = Array.from(files).find(
        (file) => !validateFile(file)
      );

      if (invalid) return;

      setLoading(true);

      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const res =
        await uploadAPI.uploadMultiple(formData);

      onUpload?.(res.data.data);

      toast.success(
        `${res.data.count} files uploaded`
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * =====================================================
   * Main Upload Handler
   * =====================================================
   */
  const handleUpload = async (files) => {
    if (!files?.length) return;

    if (multiple) {
      await uploadMultiple(files);
    } else {
      await uploadSingle(files[0]);
    }
  };

  /**
   * =====================================================
   * Drag & Drop
   * =====================================================
   */
  const handleDrop = async (e) => {
    e.preventDefault();

    setDragging(false);

    const files = e.dataTransfer.files;

    await handleUpload(files);
  };

  /**
   * =====================================================
   * Remove Preview
   * =====================================================
   */
  const removePreview = () => {
    onUpload?.(multiple ? [] : null);
  };

  /**
   * =====================================================
   * Render Preview
   * =====================================================
   */
  const renderPreview = () => {
    if (!current) return null;

    /**
     * MULTIPLE FILES
     */
    if (multiple && Array.isArray(current)) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {current.map((item, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white"
            >
              {item.resourceType === "image" ? (
                <img
                  src={item.url}
                  alt=""
                  className="w-full h-40 object-cover"
                />
              ) : item.resourceType === "video" ? (
                <video
                  src={item.url}
                  controls
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="h-40 flex items-center justify-center text-5xl">
                  📄
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    /**
     * SINGLE IMAGE
     */
    if (
      current.resourceType === "image"
    ) {
      return (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200">
          <img
            src={current.url}
            alt="Preview"
            className="w-full h-60 object-cover"
          />

          <button
            type="button"
            onClick={removePreview}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      );
    }

    /**
     * SINGLE VIDEO
     */
    if (
      current.resourceType === "video"
    ) {
      return (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-black">
          <video
            src={current.url}
            controls
            className="w-full max-h-72"
          />

          <button
            type="button"
            onClick={removePreview}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      );
    }

    /**
     * PDF
     */
    return (
      <div className="flex items-center gap-4 p-5 rounded-3xl border border-slate-200 bg-white">
        <div className="text-5xl">
          📄
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold truncate">
            {current.originalName}
          </p>

          <a
            href={current.url}
            target="_blank"
            rel="noreferrer"
            className="text-sky-600 text-sm font-semibold hover:underline"
          >
            View PDF
          </a>
        </div>

        <button
          type="button"
          onClick={removePreview}
          className="w-10 h-10 rounded-xl hover:bg-rose-50"
        >
          ✕
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* LABEL */}
      <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
        {label}
      </label>

      {/* PREVIEW */}
      {current ? (
        renderPreview()
      ) : (
        <div
          onClick={() =>
            inputRef.current?.click()
          }
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() =>
            setDragging(false)
          }
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-[2rem] p-10 text-center cursor-pointer transition-all duration-300 ${
            dragging
              ? "border-sky-500 bg-sky-50"
              : "border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-white"
          }`}
        >
          {/* INPUT */}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={(e) =>
              handleUpload(e.target.files)
            }
          />

          {/* LOADING */}
          {loading ? (
            <div>
              <div className="w-12 h-12 mx-auto rounded-full border-4 border-slate-200 border-t-sky-500 animate-spin mb-4" />

              <p className="font-semibold text-slate-500">
                Uploading...
              </p>
            </div>
          ) : (
            <div>
              <div className="text-5xl mb-4">
                {type === "image"
                  ? "🖼️"
                  : type === "video"
                  ? "🎬"
                  : "📄"}
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-2">
                Upload {type}
              </h3>

              <p className="text-sm text-slate-500">
                Drag & drop or click to browse
              </p>

              <p className="text-xs text-slate-400 mt-2">
                Max{" "}
                {MAX_SIZES[type] || 10}
                MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadBox;