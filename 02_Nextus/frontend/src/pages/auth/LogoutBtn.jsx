// src/components/auth/Logout.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../../redux/authSliceTunk/authTunk.js";
import { useNavigate } from "react-router";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutThunk())
      .unwrap()
      .then(() => {
        // Clear localStorage if needed
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        // Redirect to login
        navigate("/");
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        alert("Logout failed. Try again.");
      });
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
