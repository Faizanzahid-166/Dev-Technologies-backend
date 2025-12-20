// src/pages/WorkingOnIt.jsx
import React from "react";
import { Link } from "react-router";

export default function WorkingOnIt() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white px-4">
      {/* Main Heading */}
      <h1 className="text-5xl font-bold mb-4">🛠 Working on It</h1>

      {/* Subtitle */}
      <p className="text-lg mb-8 text-center max-w-md">
        We’re currently building something awesome here. Check back soon for updates!
      </p>

      {/* Optional Back Button */}
      <Link
        to="/"
        className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}
