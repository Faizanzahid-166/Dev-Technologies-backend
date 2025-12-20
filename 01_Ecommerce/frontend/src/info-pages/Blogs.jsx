// src/pages/Blogs.jsx
import React from "react";

export default function Blogs() {
  const blogPosts = [
    {
      title: "5 Tips for Smart Online Shopping",
      date: "August 10, 2025",
      content:
        "Online shopping can save you time and money if done wisely. In this blog, we share five practical tips to help you get the most out of your online purchases.",
    },
    {
      title: "Top 10 Must-Have Gadgets in 2025",
      date: "August 8, 2025",
      content:
        "From smart home devices to portable chargers, discover the top gadgets that are making life easier and more fun this year.",
    },
    {
      title: "How to Choose the Right Product for You",
      date: "August 5, 2025",
      content:
        "With so many products available, choosing the right one can be tricky. Here are some guidelines to help you make the best buying decisions.",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Our Blog
        </h1>

        {/* Blog List */}
        <div className="space-y-8">
          {blogPosts.map((post, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{post.date}</p>
              <p className="text-gray-600">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
