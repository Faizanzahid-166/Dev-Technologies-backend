// src/pages/dashboard/InvestorDashboard.jsx
import { useAuth } from "../../context/Authcontext";
import { Link } from "react-router";

const InvestorDashboard = () => {
  const { user } = useAuth();

  // Avatar initials
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "I";

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 mb-8 shadow-lg flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name}_{user?.role} 👋
          </h1>
          <p className="mt-2 text-blue-100">
            Here’s a quick overview of your investments, meetings, and documents.
          </p>
        </div>
        <div className="mt-6 md:mt-0">
          <div className="h-20 w-20 rounded-full bg-white text-blue-700 font-bold flex items-center justify-center text-2xl shadow-md">
            {initials}
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
          <h2 className="font-semibold text-lg">Your Investments</h2>
          <p className="text-gray-500 mt-2">
            Track startups you’ve invested in and monitor progress.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
          <h2 className="font-semibold text-lg">Meetings</h2>
          <p className="text-gray-500 mt-2">
            View and schedule meetings with entrepreneurs.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
          <h2 className="font-semibold text-lg">Documents</h2>
          <p className="text-gray-500 mt-2">
            Review agreements, term sheets, and contracts.
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/profile"
          className="flex-1 sm:flex-none text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow"
        >
          Profile
        </Link>
        <Link
          to="/finduser"
          className="flex-1 sm:flex-none text-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow"
        >
          Find User
        </Link>
      </div>
    </div>
  );
};

export default InvestorDashboard;
