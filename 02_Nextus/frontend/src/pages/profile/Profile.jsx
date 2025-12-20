import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/Authcontext.jsx";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    role: user?.role || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      alert("Profile updated!");
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="w-full flex justify-center p-4 sm:p-6 lg:p-8 mt-10">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 text-center">User Profile</h1>
        <p className="text-gray-600 text-center mt-2">
          Welcome to your profile dashboard. Here you can update your{" "}
          <span className="font-medium text-gray-800">name</span> and{" "}
          <span className="font-medium text-gray-800">role</span>, and quickly
          access important features like payments, documents, and user discovery.
        </p>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          {/* Update Name */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
            <label className="w-full sm:w-40 font-medium mb-2 sm:mb-0">
              Update Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          {/* Update Role */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
            <label className="w-full sm:w-40 font-medium mb-2 sm:mb-0">
              Update Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="entrepreneur">Entrepreneur</option>
              <option value="investor">Investor</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Quick Action Links */}
        <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-center gap-4">
          
          <Link
            to="/payments"
            className="flex-1 sm:flex-none text-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Payments
          </Link>
          <Link
            to="/documents"
            className="flex-1 sm:flex-none text-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Documents
          </Link>
          <Link
            to="/finduser"
            className="flex-1 sm:flex-none text-center bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Find User
          </Link>
             <Link
            to="/messages"
            className="flex-1 sm:flex-none text-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Messages
          </Link>
        </div>
      </div>
    </div>
  );
}
