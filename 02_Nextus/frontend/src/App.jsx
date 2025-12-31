import React, { useState, useContext } from "react";
import { Outlet } from "react-router"; // ✅ FIX
import { Navbar, Footer } from "./layout/00_index.js";
import ThemeContext from "./context/themeContext.js";

function App() {
  const { darkMode } = useContext(ThemeContext);

  return (
      <div className={darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}>
      {/* Top Navbar */}
      <Navbar  />
      
       <main className="min-h-screen">
        <Outlet />
      </main>
      
       <Footer />
    </div>
  );

}

export default App;
