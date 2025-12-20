import api from "./axiosConfig";

// Upload file
export const uploadDocument = (formData) => api.post("/documents/upload", formData, {
  withCredentials: true,
  headers: { "Content-Type": "multipart/form-data" },
});

// List user documents
export const getMyDocuments = () => api.get("/documents/my/list");

// Download file
export const downloadDocument = (fileId) => api.get(`/documents/${fileId}/download`, {
  responseType: "blob",
});

// Add signature
export const addSignature = (docId, formData) => api.post(`/documents/${docId}/sign`, formData, {
  withCredentials: true,
  headers: { "Content-Type": "multipart/form-data" },
});
