// src/api/paymentApi.js
import api from "./axiosConfig.js";

export const deposit = async (amount) => {
  const { data } = await api.post("/payments/deposit", { amount });
  return data;
};

export const withdraw = async (amount) => {
  const { data } = await api.post("/payments/withdraw", { amount });
  return data;
};

export const transfer = async (targetUserId, amount) => {
  const { data } = await api.post("/payments/transfer", { targetUserId, amount });
  return data;
};

export const getMyTransactions = async () => {
  const { data } = await api.get("/payments/my-transactions");
  return data;
};


