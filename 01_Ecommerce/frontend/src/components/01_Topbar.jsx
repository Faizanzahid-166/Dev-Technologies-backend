import { Search, Menu } from "lucide-react";
import { FaUser, FaRegEnvelope, FaClipboardList } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import { useAuth } from "../context/AuthContext.jsx";


export default function TopBar({ onMenuClick, searchTerm, setSearchTerm  }) {
 const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect to login
  };

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6 ">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <Menu size={22} className="cursor-pointer lg:hidden" onClick={onMenuClick} />
        <div className="text-blue-600 font-bold text-xl flex items-center">
          <span className="text-2xl">🛍️</span>
          <span className="ml-1">Brand</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1 w-48 sm:w-72">
          <Search size={18} className="text-gray-500"  />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none flex-1 text-sm"
            value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}

          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4 text-sm ml-4">

        <div>
          {user && (
            <div className="flex items-center gap-4">
            <span>{user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
            </div>
          )}
        </div>

        <Link to="/signup">
          <div className="hidden md:flex items-center gap-2 cursor-pointer">
            <FaUser />
            <span>Signup</span>
          </div>
        </Link>
         <Link to="/login">
        <div className="hidden md:flex items-center gap-2 cursor-pointer">
          <FaRegEnvelope />
          <span>Login</span>
        </div>
        </Link>
        <div className="hidden md:flex items-center gap-2 cursor-pointer">
          <FaClipboardList />
          <span><Link to="/comingsoon">My Orders</Link></span>
        </div>
      </div>
    </header>
  );
}
