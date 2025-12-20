// src/pages/Services.jsx
import React from "react";
import { Link } from "react-router";

export default function Services() {
  const services = [
    {
      title: "Fast Delivery",
      description: "Get your products delivered to your doorstep in record time.",
      icon: "🚚",
    },
    {
      title: "24/7 Customer Support",
      description: "We’re here for you anytime, anywhere — just a call or click away.",
      icon: "📞",
    },
    {
      title: "Easy Returns",
      description: "Not satisfied? Return your product easily within our policy period.",
      icon: "🔄",
    },
    {
      title: "Secure Payment",
      description: "We use industry-leading encryption to keep your payments safe.",
      icon: "💳",
    },
    {
      title: "Quality Guarantee",
      description: "All products are carefully inspected before delivery.",
      icon: "🏆",
    },
    {
      title: "Exclusive Offers",
      description: "Enjoy special discounts and deals for our loyal customers.",
      icon: "🎁",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">Our Services</h1>
      <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-10">
        At our store, we believe in giving you the best shopping experience possible.  
        Here’s what we offer to make your journey smooth and enjoyable.
      </p>

      {/* Services Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition duration-300"
          >
            <div className="text-5xl mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>

      {/* Back to Home */}
      <div className="text-center mt-10">
        <Link
          to="/"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-500 transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
