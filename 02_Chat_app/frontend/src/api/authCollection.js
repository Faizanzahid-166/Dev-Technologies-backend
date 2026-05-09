// src/api/authcollection.js
import Client from "../config/Client.js";

/* -------- AUTH -------- */
export const loginApi = (data) =>
  Client.post("/api/auth/login", data).then(res => res.data)

export const registerApi = (data) =>
  Client.post("/api/auth/register", data).then(res => res.data);
//console.log("signup", registerApi)

export const verifyOtpApi = (data) =>
  Client.post("/api/auth/verifyOTP", data).then(res => res.data);
//console.log("verifyOTP", verifyOtpApi)

export const resendOtpApi = (data) =>
  Client.post("/api/auth/resendOTP", data).then(res => res.data);
//console.log("resendOTP", resendOtpApi)

export const logoutApi = () =>
  Client.post("/api/auth/logout").then(res => res.data);

export const getCurrentUserApi = () =>
  Client.get("/api/auth/getCurrentUser").then(res => res.data);
