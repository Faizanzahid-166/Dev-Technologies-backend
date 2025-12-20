import React, { useState } from "react";
import { useAuth } from "../../context/Authcontext.jsx";
import { useNavigate } from "react-router";
import { connectSocket } from "../../api/Socket.js"; // optional: initialize socket after login

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // login and save user/token
      await login(formData.email, formData.password);

      // initialize socket after successful login
      connectSocket();

      setMessage("✅ Login successful!");

      const storedUser = JSON.parse(localStorage.getItem("user"));

      // redirect based on role
      if (storedUser?.role === "investor") navigate("/dashboard/investor");
      else if (storedUser?.role === "entrepreneur") navigate("/dashboard/entrepreneur");
      else navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.msg || "❌ Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {message && (
          <p className={`text-center mb-3 ${message.includes("❌") ? "text-red-500" : "text-green-500"}`}>
            {message}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          autoComplete="email"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          autoComplete="current-password"
          required
        />

        <button
          type="submit"
          className={`w-full py-2 rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
