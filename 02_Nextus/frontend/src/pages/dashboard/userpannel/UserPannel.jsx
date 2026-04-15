import React from "react";
import { Link, Outlet, useLocation } from "react-router";

function UserPannel()  {
  const location = useLocation();

  const navLinks = [
     { name: "Account", path: "/dashboard/user-pannel/info" },
    { name: "Chat", path: "/dashboard/user-pannel/chat/ChatPage" },
    { name: "Docs", path: "/dashboard/user-pannel/documents" },
    { name: "Meeting", path: "/contact" },
    { name: "Payments", path: "/error" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-white shadow-lg flex-col p-5">
        <h2 className="text-2xl font-bold mb-8 text-blue-600">
          User Panel
        </h2>

        <ul className="space-y-3">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`block px-4 py-3 rounded-xl font-medium transition-all
                  ${
                    location.pathname === link.path
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-blue-100 hover:text-blue-700"
                  }
                `}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-2 md:p-6 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden mb-2 bg-white p-2 rounded-lg shadow">
          <h1 className="text-xl font-bold text-blue-600">User Dashboard</h1>
        </div>

        {/* Outlet Pages */}
        <div className="bg-white rounded-xl shadow p-2 min-h-[85vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default UserPannel;
