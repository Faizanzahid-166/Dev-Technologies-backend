// src/pages/Contact.jsx
import React, { useState } from "react";
import {contactus} from '../api/urls.js'

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await contactus(form); // ✅ pass form data
      setStatus(res.message);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus(error.response?.data?.message || "Error sending message");
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Contact Us
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Have a question or feedback? Fill out the form and we’ll get back to you soon.
        </p>

        {/* Contact Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-3 focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-3 focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-3 focus:outline-none focus:ring focus:border-blue-400"
              rows="4"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-3 rounded-md font-medium hover:bg-blue-700 transition duration-300"
          >
            Send Message
          </button>
        </form>

        {/* Status Message */}
        {status && (
          <p className="mt-4 text-green-600 text-center font-semibold">
            {status}
          </p>
        )}

        {/* Contact Info */}
        <div className="mt-10 text-center text-gray-700">
          <p>Email: support@yourecommerce.com</p>
          <p>Phone: +92 300 1234567</p>
          <p>Address: 123 Main Street, Karachi, Pakistan</p>
        </div>
      </div>
    </div>
  );
}
