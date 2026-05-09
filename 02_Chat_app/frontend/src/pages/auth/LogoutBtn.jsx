// src/components/auth/Logout.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../../redux/authSliceTunk/authTunk.js";
import { useNavigate } from "react-router";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Dispatch logout thunk
      await dispatch(logoutThunk()).unwrap();

      // Clear any localStorage cache
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Redirect to home/login page
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      alert(err?.message || "Logout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`px-4 py-2 rounded-md text-white transition-colors ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
      }`}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}

export default LogoutBtn;
