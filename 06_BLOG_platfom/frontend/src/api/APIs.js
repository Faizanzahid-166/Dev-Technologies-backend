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

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => Client.post('/api/auth/signup', data),
  login: (data) => Client.post('/api/auth/login', data),
  getMe: () => Client.get('/api/auth/me'),
  logout: () => Client.post('/api/auth/logout'),
};

// Blog API
export const blogAPI = {
  getAll: (params) => Client.get('/api/blogs', { params }),
  getFeatured: () => Client.get('/api/blogs/featured'),
  getTrending: () => Client.get('/api/blogs/trending'),
  getCategories: () => Client.get('/api/blogs/categories'),
  getBySlug: (slug) => Client.get(`/api/blogs/${slug}`),
  // Admin
  adminGetAll: (params) => Client.get('/api/blogs/admin/all', { params }),
  getById: (id) => Client.get(`/api/blogs/admin/id/${id}`),
  getStats: () => Client.get('/api/blogs/admin/stats'),
  create: (data) => Client.post('/api/blogs', data),
  update: (id, data) => Client.put(`/api/blogs/${id}`, data),
  delete: (id) => Client.delete(`/api/blogs/${id}`),
  like: (id, data) => Client.post(`/api/blogs/${id}/like`, data),
};
 
// Upload API

export const uploadAPI = {
    /**
   * =====================================================
   * Get Inline PDF URL
   * =====================================================
   */
  getInlinePDF: (url) =>
  `/api/upload/inline-pdf?url=${encodeURIComponent(url)}`,

  /**
   * =====================================================
   * Upload Single File
   * Supports:
   * - image
   * - video
   * - pdf
   * =====================================================
   */
  uploadSingle: (formData) =>
    Client.post("/api/upload/single",formData,{ headers: {"Content-Type": "multipart/form-data",},}),

  /**
   * =====================================================
   * Upload Multiple Files
   * =====================================================
   */
  uploadMultiple: (formData) =>
    Client.post("/api/upload/multiple",formData,{headers: {"Content-Type": "multipart/form-data",}, }
    ),

  /**
   * =====================================================
   * Update Existing File
   * =====================================================
   */
  updateFile: (publicId, formData) =>
    Client.put(`/api/upload/update/${publicId}`,formData,{headers: {"Content-Type": "multipart/form-data",},}
    ),

  /**
   * =====================================================
   * Delete File
   * =====================================================
   */
  deleteFile: (data) =>
     Client.delete("/api/upload/delete",{ data,}
    ),


};
 
// Comment API
export const commentAPI = {
  getByBlog: (blogId) => Client.get(`/api/comments/${blogId}`),
  add: (blogId, data) => Client.post(`/api/comments/${blogId}`, data),
  delete: (id) => Client.delete(`/api/comments/${id}`),
};
 
// Newsletter API
export const newsletterAPI = {
  subscribe: (email) => Client.post('/api/newsletter/subscribe', { email }),
  getSubscribers: () => Client.get('/api/newsletter/subscribers'),
};
