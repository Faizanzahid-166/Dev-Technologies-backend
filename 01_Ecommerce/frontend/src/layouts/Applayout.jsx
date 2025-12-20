// src/layouts/AppLayout.jsx
import {useState} from 'react'
import { Outlet } from "react-router";
import {Sidebar, Topbar, Linkbar} from '../components/000_index.js'
import {Footer} from './01_index.js'
import ScrollToTop from "../components/12_ScrollToTop.jsx";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ global state
  return (
 <div className="w-fit  bg-gray-50 mx-auto p-2">
  {/* <div className='w-fit'> */}

  <ScrollToTop />
      {/* Mobile Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Top Bar */}
      <Topbar onMenuClick={() => setIsSidebarOpen(true)}  searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}/>

      {/* Link Bar */}
      <Linkbar/>

      

      {/* Page Content */}
      <main className="p-4">
        <Outlet context={{ searchTerm }} /> {/* ✅ pass to child routes */}
      </main>

      <Footer />
    </div>
    // </div>
  );
}
