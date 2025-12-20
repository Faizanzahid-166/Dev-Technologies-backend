import React, { useState } from "react";
import { Outlet } from "react-router"; // ✅ FIX
import { Navbar, Menu, Sidebar } from "./layout/0_index.js";
import { useAuth } from "./hooks/useAuth";

function Home() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full flex flex-col min-h-screen mx-auto">
      {/* Top Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      {user ? (
        <div className="flex flex-1">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 border-r bg-gray-50">
            <Menu />
          </div>

          {/* Mobile Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            logout={logout}
            user={user}
          />

          {/* Page Content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      ) : (
        // If not logged in → show outlet in full width
        <main className="flex-1 p-6 flex items-center justify-center bg-gray-100">
          <Outlet />
        </main>
      )}
    </div>
  );
}

export default Home;
