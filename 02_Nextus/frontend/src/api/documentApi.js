// documentApi.js
import api from "./axiosConfig";


// Upload file
export const uploadDocument = (formData) => {
  return api.post("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true, // if backend uses cookie auth
  });
};



// List my documents
export const getMyDocuments = () => api.get("/documents/my/list");

// Get single document metadata
export const getDocument = (id) => api.get(`/documents/${id}`);

// Download (as blob for saving)
export const downloadDocument = (id, token) =>
  api.get(`/documents/${id}/download`, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${token}` },
  });



// Sign with file upload
export const addSignature = (id, formData) =>
  api.put(`/documents/${id}/sign`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
