import { useState, useCallback, useEffect } from "react";
import { fetchAllPDFs, uploadPDF, deletePDF } from "../api/docsCollection.js";
import toast from "react-hot-toast";

export const usePDFs = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const loadPDFs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await fetchAllPDFs();
      setPdfs(data.data || []);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load PDFs.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpload = useCallback(
    async (file) => {
      if (!file) return;
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed.");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size must be under 20MB.");
        return;
      }

      const formData = new FormData();
      formData.append("pdf", file);

      try {
        setUploading(true);
        setUploadProgress(0);

        const { data } = await uploadPDF(formData, (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        });

        setPdfs((prev) => [data.data, ...prev]);
        toast.success("PDF uploaded successfully!");
        return data.data;
      } catch (err) {
        toast.error(err.message || "Upload failed.");
        throw err;
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    []
  );

  const handleDelete = useCallback(async (id) => {
    try {
      await deletePDF(id);
      setPdfs((prev) => prev.filter((p) => p._id !== id));
      toast.success("PDF deleted.");
    } catch (err) {
      toast.error(err.message || "Delete failed.");
    }
  }, []);

  useEffect(() => {
    loadPDFs();
  }, [loadPDFs]);

  return {
    pdfs,
    loading,
    uploading,
    uploadProgress,
    error,
    handleUpload,
    handleDelete,
    reload: loadPDFs,
  };
};