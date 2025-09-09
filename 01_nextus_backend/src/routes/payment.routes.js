import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  deposit,
  withdraw,
  transfer,
  getMyTransactions,
} from "../controllers/payment.ontroller.js";
import Stripe from "stripe";

const router = express.Router();

router.post("/deposit", protect, deposit);
router.post("/withdraw", protect, withdraw);
router.post("/transfer", protect, transfer);
router.get("/my-transactions", protect, getMyTransactions);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ----------------------------
// Stripe Deposit
// ----------------------------
router.post("/stripe/deposit", protect, async (req, res, next) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // cents
      currency: "usd",
      metadata: { userId: req.user._id.toString() },
    });

    // Save pending transaction
    const tx = await Transaction.create({
      user: req.user._id,
      type: "deposit",
      amount,
      status: "Pending",
      reference: paymentIntent.id,
    });

    res.json({ clientSecret: paymentIntent.client_secret, transaction: tx });
  } catch (err) {
    next(err);
  }
});

// ----------------------------
// Stripe Webhook
// ----------------------------
router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;

      await Transaction.findOneAndUpdate(
        { reference: intent.id },
        { status: "Completed" }
      );
    }

    if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object;
      await Transaction.findOneAndUpdate(
        { reference: intent.id },
        { status: "Failed" }
      );
    }

    res.json({ received: true });
  }
);

// ----------------------------
// Withdraw (Mock Example)
// ----------------------------
router.post("/withdraw", protect, async (req, res, next) => {
  try {
    const { amount } = req.body;

    // You can later integrate PayPal or Stripe Connect for real payouts
    const tx = await Transaction.create({
      user: req.user._id,
      type: "withdraw",
      amount,
      status: "Completed", // Mock: always success
    });

    res.json({ transaction: tx });
  } catch (err) {
    next(err);
  }
});

// ----------------------------
// Transfer (Mock Example)
// ----------------------------
router.post("/transfer", protect, async (req, res, next) => {
  try {
    const { toUserId, amount } = req.body;

    // Create "debit" for sender
    const senderTx = await Transaction.create({
      user: req.user._id,
      type: "transfer",
      amount,
      toUser: toUserId,
      status: "Completed", // Mock
    });

    // Create "credit" for receiver
    const receiverTx = await Transaction.create({
      user: toUserId,
      type: "transfer",
      amount,
      fromUser: req.user._id,
      status: "Completed",
    });

    res.json({ sender: senderTx, receiver: receiverTx });
  } catch (err) {
    next(err);
  }
});

// ----------------------------
// Transaction History
// ----------------------------
router.get("/transactions", protect, async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

export default router;



