// src/pages/PaymentPage.jsx
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { deposit, withdraw, transfer } from "../../api/realpaymentApi.js";
import realtimEnv from '../../api/realtimeEnv.js'

const stripePromise = loadStripe(realtimEnv.STRIPE_PUBLIC_KEY);

const PaymentForm = () => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  // ✅ Deposit via Stripe
  const handleDeposit = async () => {
    try {
      if (!stripe || !elements) return;

      const { clientSecret } = await deposit(amount);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setMessage(`❌ Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("✅ Deposit successful!");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong with deposit.");
    }
  };

  // ✅ Withdraw (mock)
  const handleWithdraw = async () => {
    try {
      const res = await withdraw(amount);
      setMessage(`Withdraw status: ${res.transaction.status}`);
    } catch (err) {
      setMessage("❌ Withdraw failed.");
    }
  };

  // ✅ Transfer (mock)
  const handleTransfer = async () => {
    try {
      const res = await transfer("USER_ID_HERE", amount); // TODO: replace with actual userId
      setMessage(`Transfer status: ${res.sender.status}`);
    } catch (err) {
      setMessage("❌ Transfer failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">💳 Payment Page</h2>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      <div className="p-3 border rounded mb-4">
        <CardElement />
      </div>

      <div className="space-x-2">
        <button
          onClick={handleDeposit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Deposit
        </button>
        <button
          onClick={handleWithdraw}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Withdraw
        </button>
        <button
          onClick={handleTransfer}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Transfer
        </button>
      </div>

      {message && (
        <p className="mt-4 text-sm font-medium text-gray-700">{message}</p>
      )}
    </div>
  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default PaymentPage;
