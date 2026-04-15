// src/pages/UserDashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUserThunk,
  logoutThunk,
} from "../../../redux/authSliceTunk/authTunk.js";
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

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {JSON.stringify(error)}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-semibold">User Dashboard</h1>
          <p className="text-sm opacity-90">Account information</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <InfoRow label="Name" value={user.name} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Role" value={user.role} />

          {user.customerType && (
            <InfoRow label="Customer Type" value={user.customerType} />
          )}

          <InfoRow
            label="Email Verified"
            value={user.emailVerified ? "Yes" : "No"}
            badge={user.emailVerified}
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({ label, value, badge }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-500 text-sm">{label}</span>
    {typeof badge === "boolean" ? (
      <span
        className={`px-3 py-1 text-xs rounded-full font-medium ${
          badge
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {value}
      </span>
    ) : (
      <span className="font-medium text-gray-800">{value}</span>
    )}
  </div>
);

export default User;
