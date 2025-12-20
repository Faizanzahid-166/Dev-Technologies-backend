import React from "react";
import { Link,Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth"; // custom hook that uses AuthContext

const Menu = () => {
  const { user } = useAuth();

  return (
    <>
        {user && (
    <div className="p-4 h-full">
  
        <nav className="flex flex-col gap-3 h-full overflow-y-auto">
          <Link to={user.role === "investor" ? "/dashboard/investor" : "/dashboard/entrepreneur"}
           className="text-blue-600 hover:bg-gray-200 p-2 rounded">
            Dashboard
          </Link>
          <Link to="/profile" className="text-blue-600 hover:bg-gray-200 p-2 rounded">
            My Startup
          </Link>
          <Link to="/finduser" className="text-blue-600 hover:bg-gray-200 p-2 rounded">
            Find Investors
          </Link>
          <Link to="/transactions" className="text-blue-600 hover:bg-gray-200 p-2 rounded">
            local Payments
          </Link>
          <Link to="/realtransactions" className="text-blue-600 hover:bg-gray-200 p-2 rounded">
            real Payments
          </Link>
          <Link to="/documents/signature" className="text-blue-600 hover:bg-gray-200 p-2 rounded">
            Documents
          </Link>
          <Link to="/messages/meetingArangment" className="text-blue-600 hover:bg-gray-200 p-2 rounded">
            Meeting
          </Link>

          <label className="mt-2 font-semibold">Settings</label>
          <Link to="/ss" className="text-blue-600 hover:bg-gray-200 p-1 rounded">
            Setting
          </Link>
          <Link to="/hh" className="text-blue-600 hover:bg-gray-200 p-1 rounded">
            Help & Support
          </Link>
        </nav>
 
    </div>
         )}
    </>
  );
};

export default Menu;