// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          About Us
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Welcome to <span className="text-blue-600 font-semibold">ShopEase</span>, 
          your one-stop shop for high-quality products delivered to your doorstep.
        </p>

        {/* Mission & Story */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left - Text */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded in 2025, ShopEase began with a simple mission – 
              to make online shopping easier, faster, and more reliable. 
              From humble beginnings, we’ve grown into a trusted platform 
              serving thousands of happy customers worldwide.
            </p>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              We aim to provide the best products at affordable prices, 
              backed by exceptional customer service. Whether you’re 
              looking for electronics, clothing, or home essentials, 
              we’ve got you covered.
            </p>
          </div>

          {/* Right - Image */}
          <div className="flex justify-center items-center">
            <img
              src="https://images.unsplash.com/photo-1542831371-29b0f74f9713"
              alt="About Us"
              className="rounded-xl shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Fast Delivery",
                desc: "Get your products delivered quickly and safely to your doorstep.",
              },
              {
                title: "Quality Products",
                desc: "We source only the best products to ensure satisfaction.",
              },
              {
                title: "Customer Support",
                desc: "Our team is here to help you 24/7 with any queries.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
