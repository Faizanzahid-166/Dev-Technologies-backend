import React, { useState } from "react";
import { useAuth } from "../../context/Authcontext.jsx";
import { useNavigate } from "react-router";

export default function Registration() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "", // user must select
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) {
      setMessage("Please select a role");
      return;
    }

   try {
  await register(
    formData.name,
    formData.email,
    formData.password,
    formData.role
  );
  setMessage("Registration successful!");

  // Redirect based on role
  if (formData.role === "investor") {
    navigate("/login");
  } else if (formData.role === "entrepreneur") {
    navigate("/login");
  }
} catch (err) {
  setMessage(err.response?.data?.msg || "Registration failed");
}

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {message && <p className="text-center text-red-500">{message}</p>}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        >
          <option value="">Select Role</option>
          <option value="entrepreneur">Entrepreneur</option>
          <option value="investor">Investor</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
}
