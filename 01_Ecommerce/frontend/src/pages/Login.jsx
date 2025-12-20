import { useState } from "react";
import { loginUser } from "../api/urls.js";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext"; // ✅ import context

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ get login function from context

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = await loginUser(form); // already res.data
    console.log("Login Response:", data);

    if (data.message === "Login successful") {
      // Save token for future authenticated requests
      localStorage.setItem("token", data.token);
      // Save user info
      localStorage.setItem("user", JSON.stringify(data.user));
      

      // Update context so ProtectedRoute knows user is logged in
      login(data.user); // Pass full user object

      setMessage("Login successful");
      navigate("/"); // redirect to home
    } else {
      setMessage("Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    setMessage(error.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="flex flex-col items-center justify-center mt-15">
      <div className="w-full max-w-md bg-[#adadad] rounded-xl shadow-md py-2 px-8">
        <h1 className="text-green-800 text-[28px] text-center font-bold mt-3 py-6">
          Login
        </h1>

        <Link to="/signup" className="m-2 hover:text-blue-500">
          <p>Don’t have an account? Sign up</p>
        </Link>

        <form onSubmit={handleSubmit} className="grid gap-10 self-center">
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full bg-gray-700 text-white border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none transition ease-in-out duration-150 placeholder-gray-300"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full bg-gray-700 text-white border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none transition ease-in-out duration-150 placeholder-gray-300"
          />

          <button
            type="submit"
            className="bg-cyan-500 w-1/2 text-white border-0 rounded-md p-2 focus:bg-blue-600 focus:outline-none transition ease-in-out duration-150 mx-auto"
          >
            Login
          </button>

          <p className="text-red-600">{message}</p>
        </form>
      </div>
    </div>
  );
}
