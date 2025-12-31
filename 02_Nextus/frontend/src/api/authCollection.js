// src/api/authcollection.js
import api from "../config/axiosConfig.js";

/* -------- AUTH -------- */
export const loginApi = (data) =>
  api.post("/api/auth/login", data).then(res => res.data);


export const registerApi = (data) =>
  api.post("/api/auth/register", data).then(res => res.data);
//console.log("signup", registerApi)

export const verifyOtpApi = (data) =>
  api.post("/api/auth/verifyOTP", data).then(res => res.data);
//console.log("verifyOTP", verifyOtpApi)

export const resendOtpApi = (data) =>
  api.post("/api/auth/resendOTP", data).then(res => res.data);
//console.log("resendOTP", resendOtpApi)

export const logoutApi = () =>
  api.post("/api/auth/logout").then(res => res.data);

export const getCurrentUserApi = () =>
  api.get("/api/auth/getCurrentUser").then(res => res.data);
