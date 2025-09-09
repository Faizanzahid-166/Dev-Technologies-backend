import { Transaction } from "../models/transaction.model.js";
import { v4 as uuidv4 } from "uuid";

// Mock "process payment" function
const mockPaymentGateway = async () => {
  return { success: true, reference: uuidv4() }; // always succeed for mock
};

// Deposit
export const deposit = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const transaction = await Transaction.create({
      user: req.user._id,
      type: "deposit",
      amount,
    });

    // Mock gateway call
    const result = await mockPaymentGateway();

    if (result.success) {
      transaction.status = "Completed";
      transaction.reference = result.reference;
    } else {
      transaction.status = "Failed";
    }

    await transaction.save();
    res.json({ success: true, transaction });
  } catch (err) {
    next(err);
  }
};

// Withdraw
export const withdraw = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const transaction = await Transaction.create({
      user: req.user._id,
      type: "withdraw",
      amount,
    });

    // Mock gateway call
    const result = await mockPaymentGateway();

    if (result.success) {
      transaction.status = "Completed";
      transaction.reference = result.reference;
    } else {
      transaction.status = "Failed";
    }

    await transaction.save();
    res.json({ success: true, transaction });
  } catch (err) {
    next(err);
  }
};

// Transfer
export const transfer = async (req, res, next) => {
  try {
    const { targetUserId, amount } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      type: "transfer",
      amount,
      targetUser: targetUserId,
    });

    // Mock gateway call
    const result = await mockPaymentGateway();

    if (result.success) {
      transaction.status = "Completed";
      transaction.reference = result.reference;
    } else {
      transaction.status = "Failed";
    }

    await transaction.save();
    res.json({ success: true, transaction });
  } catch (err) {
    next(err);
  }
};

// Get all transactions for a user
export const getMyTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .populate("targetUser", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, transactions });
  } catch (err) {
    next(err);
  }
};
