// src/components/Sidebar.jsx
import { NavLink , Link} from "react-router";
import { X, Home, ShoppingBag, ShoppingCart, } from "lucide-react";
import { FaUser, FaRegEnvelope,  } from 'react-icons/fa';
export default function Sidebar({ isOpen, onClose }) {
  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Sidebar panel */}
      <aside className="relative w-64 bg-white h-full shadow-md flex flex-col z-50">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <span className="font-bold text-lg">🛍️ MyShop</span>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-2">

          <div className="flex items-center bg-green-600 text-white font-bold  gap-2 cursor-pointer p-3">
             <Link to="/adminpanel">AdminPanel</Link> 
          </div>


          <NavLink
            to="/"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
              }`
            }
          >
            <Home size={18} /> Home
          </NavLink>

          <NavLink
            to="/productspage"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
              }`
            }
          >
            <ShoppingBag size={18} /> Products
          </NavLink>

          <NavLink
            to="/cartpage"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
              }`
            }
          >
            <ShoppingCart size={18} /> Cart
          </NavLink>

           <Link to="/signup"   className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
              }`
            }>
          <div className="flex items-center gap-2 cursor-pointer p-3">
            <FaUser /> 
            <span>Signup</span>
            
          </div>
        </Link>

         <Link to="/login" >
        <div className="flex items-center gap-2 cursor-pointer p-3">
          <FaRegEnvelope />
          <span>Login</span>
        </div>
        </Link>

        {/* fot general */}
        <div className="flex items-center gap-2 cursor-pointer p-3">
         <Link to="/about" >About Us</Link>
        </div>
                
          <div className="flex items-center gap-2 cursor-pointer p-3">
             <Link to="/blogs"   >Blogs</Link>
          </div>

          <div className="flex items-center gap-2 cursor-pointer p-3">
             <Link to="/comingsoon">Help Center</Link>
          </div>

          <div className="flex items-center gap-2 cursor-pointer p-3">  
             <Link to="/moneyrefundcomingsoon"  >Money Refund</Link>
          </div>   

          <div className="flex items-center gap-2 cursor-pointer p-3">
             <Link to="/contact">Contact us</Link> 
          </div>

          <div className="flex items-center gap-2 cursor-pointer p-3">
              <Link to="/workingonit"  >Settings</Link>
          </div>    

          <div className="flex items-center gap-2 cursor-pointer p-3">
                <Link to="/comingsoon"  >My Orders</Link>
          </div>      
        </nav>
      </aside>
    </div>
  );
}
