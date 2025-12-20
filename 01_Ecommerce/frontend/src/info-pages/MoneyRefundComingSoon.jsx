// src/pages/MoneyRefundComingSoon.jsx
import React from "react";
import { Link } from "react-router";

export default function MoneyRefundComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-900 to-green-700 text-white px-4">
      {/* Icon / Emoji */}
      <div className="text-6xl mb-4">💰</div>

      {/* Heading */}
      <h1 className="text-4xl font-bold mb-2">Money Refund Policy</h1>
      <h2 className="text-2xl font-semibold mb-6">Coming Soon</h2>

      {/* Description */}
      <p className="text-lg text-center max-w-md mb-8">
        We’re working on finalizing our refund policy to ensure your purchases are safe and worry-free.
        Please check back soon for updates!
      </p>

      {/* Back Home Button */}
      <Link
        to="/"
        className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}
