import { useNavigate } from "react-router";
import ThemeContext from "../../context/themeContext.js";
import React, { useState, useContext } from "react";

const Home = () => {
  const navigate = useNavigate();
    const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`h-screen px-6 py-12 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to MyStore
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Discover a modern shopping experience built with React and Vite.
          Fast performance, clean UI, and smooth user interactions — all in
          one powerful platform.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg
                     hover:bg-indigo-700 transition duration-300"
        >
          Explore Products
        </button>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="bg-gray-100 p-6 rounded-xl text-center shadow-sm">
          <h3 className="text-xl text-black font-semibold mb-2">⚡ Fast & Reliable</h3>
          <p className="text-gray-600">
            Built with Vite for lightning-fast load times and optimized
            performance.
          </p>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl text-center shadow-sm">
          <h3 className="text-xl text-black font-semibold mb-2">🔐 Secure Platform</h3>
          <p className="text-gray-600">
            Secure APIs and authentication keep your data safe and protected.
          </p>
        </div>

        <div className="bg-gray-100 p-6 rounded-xl text-center shadow-sm">
          <h3 className="text-xl text-black font-semibold mb-2">📱 Fully Responsive</h3>
          <p className="text-gray-600">
            Designed to look great on mobile, tablet, and desktop devices.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
