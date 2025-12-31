import { Link } from "react-router";  // ✅ fix import
import { X } from "lucide-react";

const Sidebar = ({ isOpen, onClose}) => {
  
   const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Docs", path: "/docs" },
    { name: "Contact", path: "/contact" },
    { name: "Error", path: "/error" }, //  Added Marvel link
  ];

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
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
          {/* Desktop menu */}
      <ul className="mt-6 flex flex-col gap-4 px-4 flex-1">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link to={link.path} className="hover:text-red-500 cursor-pointer">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      </div>
    </>
  );
};

export default Sidebar;
