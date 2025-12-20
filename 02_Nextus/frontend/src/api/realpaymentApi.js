// src/api/paymentApi.js
import api from "./axiosConfig.js";

// Deposit with Stripe
export const deposit = async (amount) => {
  const { data } = await api.post("/payments/stripe/deposit", { amount });
  return data; // { clientSecret, transaction }
};

// Withdraw (mock)
export const withdraw = async (amount) => {
  const { data } = await api.post("/payments/withdraw", { amount });
  return data; // { transaction }
};

// Transfer (mock)
export const transfer = async (toUserId, amount) => {
  const { data } = await api.post("/payments/transfer", { toUserId, amount });
  return data; // { sender, receiver }
};

// Get user’s transactions
export const getTransactions = async () => {
  const { data } = await api.get("/payments/transactions");
  return data; // [ ...transactions ]
};
