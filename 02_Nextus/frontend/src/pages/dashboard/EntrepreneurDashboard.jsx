// src/pages/dashboard/EntrepreneurDashboard.jsx
import { useAuth } from "../../context/Authcontext";
import { Link } from "react-router";

const EntrepreneurDashboard = () => {
  const { user } = useAuth();

  // Avatar initials
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "E";

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 mb-8 shadow-lg flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name}_{user?.role} 🚀
          </h1>
          <p className="mt-2 text-pink-100">
            Manage your startups, meetings, and funding opportunities all in one place.
          </p>
        </div>
        <div className="mt-6 md:mt-0">
          <div className="h-20 w-20 rounded-full bg-white text-pink-600 font-bold flex items-center justify-center text-2xl shadow-md">
            {initials}
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
          <h2 className="font-semibold text-lg">Your Startups</h2>
          <p className="text-gray-500 mt-2">
            Manage startups and pitch ideas directly to investors.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
          <h2 className="font-semibold text-lg">Meetings</h2>
          <p className="text-gray-500 mt-2">
            Schedule and connect with potential investors.
          </p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
          <h2 className="font-semibold text-lg">Funding</h2>
          <p className="text-gray-500 mt-2">
            Track funding rounds, milestones, and payments.
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/profile"
          className="flex-1 sm:flex-none text-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow"
        >
          Profile
        </Link>
        <Link
          to="/finduser"
          className="flex-1 sm:flex-none text-center bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg shadow"
        >
          Find Investor
        </Link>
        <Link
          to="*"
          className="flex-1 sm:flex-none text-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow"
        >
          Error
        </Link>
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;
