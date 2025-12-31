// src/pages/UserDashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserThunk, logoutThunk } from "../../../redux/authSliceTunk/authTunk.js";
import { useNavigate } from "react-router";

function User() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUserThunk());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logoutThunk())
      .unwrap()
      .then(() => navigate("/"))
      .catch((err) => console.error(err));
  };

  if (loading || !user) return <div>Loading...</div>;

  if (error) return <div className="text-red-500">{JSON.stringify(error)}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        {user.customerType && (
          <p>
            <strong>Customer Type:</strong> {user.customerType}
          </p>
        )}
        <p>
          <strong>Email Verified:</strong> {user.emailVerified ? "Yes" : "No"}
        </p>

        <button
          onClick={handleLogout}
          className="mt-6 w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default User;
