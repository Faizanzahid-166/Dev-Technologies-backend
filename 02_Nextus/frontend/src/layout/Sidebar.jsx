import { Link } from "react-router";  // ✅ fix import
import { X } from "lucide-react";

const Sidebar = ({ isOpen, onClose, logout, user }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Header with user info + close button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex flex-col">
            {user ? (
              <>
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-gray-400">{user.role}</span>
              </>
            ) : (
              <span className="text-sm text-gray-300">Guest</span>
            )}
          </div>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="mt-6 flex flex-col gap-4 px-4 flex-1">
          <Link to="/dashboard" className="hover:bg-gray-700 px-4 py-2 rounded">
            Dashboard
          </Link>
          <Link to="/finduser" className="hover:bg-gray-700 px-4 py-2 rounded">
            Find User
          </Link>
          <Link to="/messages" className="hover:bg-gray-700 px-4 py-2 rounded">
            Messages
          </Link>
             <Link to="/documents" className="hover:bg-gray-700 px-4 py-2 rounded">
            Documents
          </Link>
          <Link to="/transactions" className="hover:bg-gray-700 px-4 py-2 rounded">
            Payments
          </Link>
          <Link to="/profile" className="hover:bg-gray-700 px-4 py-2 rounded">
            Profile
          </Link>
        </nav>

        {/* Logout button */}
        {user && (
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={logout}
              className="w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
