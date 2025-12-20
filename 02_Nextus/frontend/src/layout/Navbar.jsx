import { Link, useNavigate } from "react-router"; // ✅ fix import
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { Menu as MenuIcon } from "lucide-react"; // ✅ hamburger icon
import Sidebar from "./Sidebar.jsx"; // ✅ your sidebar

const Navbar = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // ✅ add navigate

   const handleLogout = () => {
    logout(); // clears token and user
    navigate("/login", { replace: true }); // immediate redirect
  };

  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-3 shadow-lg flex items-center justify-between ">
      {/* Left: logo + mobile menu button */}
      <div className="flex items-center gap-4">
        {user && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded hover:bg-gray-800"
          >
            <MenuIcon size={22} />
          </button>
        )}
        <Link to="/" className="text-xl font-bold tracking-wide">
          Nexus
        </Link>
      </div>

      {/* Desktop links (only if logged in) */}
      {user && (
        <div className="hidden md:flex items-center gap-6">
          <Link
            to={user.role === "investor" ? "/dashboard/investor" : "/dashboard/entrepreneur"}
            className="hover:text-gray-300"
          >
            Dashboard
          </Link>
          <Link to="/messages" className="hover:text-gray-300">
            Messages
          </Link>
          <Link to="/documents" className="hover:text-gray-300">
            Documents
          </Link>
          <Link to="/finduser" className="hover:text-gray-300">
            Find User
          </Link>
          <Link to="/profile" className="hover:text-gray-300">
            Profile
          </Link>
        </div>
      )}

      {/* Right side */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="hidden md:inline text-sm">{user.name}_{user.role}</span>
            <button
              onClick={handleLogout} 
              className="hidden md:inline bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-md text-sm"
            >
              Login
            </Link>
            <Link
              to="/registration"
              className="border border-blue-500 px-4 py-1 rounded-md text-sm"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Sidebar (slides in when open) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
         logout={handleLogout} 
        user={user}
      />
    </nav>
  );
};

export default Navbar;
