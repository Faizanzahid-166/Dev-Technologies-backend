// models/transaction.model.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdraw", "transfer"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // for transfers
      default: null,
    },
    reference: {
      type: String, // e.g., Stripe/PayPal transaction id
      default: null,
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
