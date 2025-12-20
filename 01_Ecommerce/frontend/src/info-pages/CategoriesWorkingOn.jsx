// src/pages/CategoriesWorkingOn.jsx
import React from "react";
import { Link } from "react-router";

export default function CategoriesWorkingOn() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-700 text-white px-4">
      {/* Icon */}
      <div className="text-6xl mb-4">🛍️</div>

      {/* Main Heading */}
      <h1 className="text-4xl font-bold mb-2">Categories</h1>
      <h2 className="text-2xl font-semibold mb-6">We’re Working on Different Categories</h2>

      {/* Description */}
      <p className="text-lg text-center max-w-lg mb-8">
        Our team is curating an amazing variety of products for you.  
        From fashion to gadgets, home décor to daily essentials — we’re making sure every category is stocked with the best!
      </p>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
}
