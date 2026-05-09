// src/api/contactApi.js
import Client from "./Client.js";

export const checkHealth = async (data) => {
    const res = await Client.get("/api/health", data);
    return res.data;
    // 👉 DevTools → Network tab → Refresh page
    // What to check:
    // ✅ Status = 200 → backend connected
    // ❌ 404 → wrong route
    // ❌ 500 → backend error
    // ❌ CORS error → config issue

};


export const uploadPDF = (formData, onUploadProgress) =>
  Client.post("/api/pdfs/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });

export const fetchAllPDFs = () => Client.get("/api/pdfs");

export const deletePDF = (id) => Client.delete(`/api/pdfs/${id}`);

export const getDownloadUrl = (id) => Client.get(`/api/pdfs/${id}/download`);

// Opens PDF in a new browser tab (Content-Disposition: inline)
export const getInlineUrl = (id) => Client.get(`/api/pdfs/${id}/inline`);
 


export default Client;
