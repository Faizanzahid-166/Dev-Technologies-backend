
import axios from "axios";
import importenv from './importenv.js'
//const BASE_URL = "http://localhost:5000/api";

//const PROXY = '/api'; // thanks to proxy, no localhost:5000 here


// const BASE_URL = axios.create({
//    baseURL:  "https://dev-technologies-backend.onrender.com/api", // ✅ backend URL
//  });

// api.js


// export const BASE_URL = axios.create({
//   baseURL:   importenv.backendURL || importenv.nodeURL ,
//   withCredentials: true
// });



const isProd = import.meta.env.PROD;

export const BASE_URL = axios.create({
  baseURL: isProd ? importenv.nodeURL : importenv.backendURL,
  withCredentials: true
});

console.log("check",BASE_URL.defaults.baseURL);

// Product APIs
export const getAllProducts = (params) =>
  BASE_URL.get("/products", { params }).then((res) => res.data)
  
export const getProductById = (id) =>
  BASE_URL.get(`/products/${id}`).then((res) => res.data);
// export const getProductById = (id) => {
//   return axios.get(`${PROXY}/products/${id}`).then((res) => res.data);
// };

// export const createProduct = (data) =>
//   BASE_URL.post("/products", data).then((res) => res.data);

// export const updateProduct = (id, data) =>
//   BASE_URL.put(`/products/${id}`, data).then((res) => res.data);

// export const deleteProduct = (id) =>
//   BASE_URL.delete(`/products/${id}`).then((res) => res.data);

// Create product (expects FormData)
export const createProduct = async (formData) => {
  const res = await BASE_URL.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Update product (expects FormData)
export const updateProduct = async (id, formData) => {
  const res = await BASE_URL.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const res = await BASE_URL.delete(`/products/${id}`);
  return res.data;
};

// Banner APIs (if you have them later)

// export const getBanners = (params) => {
//   return axios.get(`${PROXY}/ownproduct/bannerinfo`,{ params }).then(res => res.data.data);
// };
export const getBanners = (params) => {
  return BASE_URL.get("/ownproduct/bannerinfo", { params })
    .then(res => res.data.data);
};

// export const getBanners = (params) => {
//   return BASE_URL.get("/ownproduct/bannerinfo", { params })
//     .then(res => res.data.data); // return only banners array, not full response
// };


// export const getBannerById =  (id) => {
//   return axios.get(`${PROXY}/ownproduct/${id}`).then((res) => res.data);
// };

export const getBannerById = (id) => {
  return BASE_URL.get(`/ownproduct/${id}`).then((res) => res.data);
};

// auth logic
// Auth APIs
export const registerUser = (userData) =>
  BASE_URL.post("/auth/register", userData).then((res) => res.data);

export const loginUser = (credentials) =>
  BASE_URL.post("/auth/login", credentials).then((res) => res.data);

export const logoutUser = () =>
  BASE_URL.post("/auth/logout").then((res) => res.data);


// Contact Us API
export const contactus = (formData) =>
  BASE_URL.post("/contact", formData).then((res) => res.data);

// ----------------- Cart APIs -----------------

export const addToCart = (productId, quantity, token) =>
  BASE_URL.post(
    "/cart",
    { productId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const getCart = (token) =>
  BASE_URL.get("/cart", { headers: { Authorization: `Bearer ${token}` } });

// urls.js
// export const updateCartItem = (productId, quantity, token) =>
//   axios.put(
//     `http://localhost:5000/api/cart/item/${productId}`,
//     { quantity },
//     { headers: { Authorization: `Bearer ${token}` } }
//   );

export const updateCartItem = (productId, quantity, token) =>
  BASE_URL.put(
    `/cart/item/${productId}`,
    { quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );


// urls.js
export const removeFromCart = (productId, token) =>
  BASE_URL.delete(`/cart/item/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
