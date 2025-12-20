import React from "react";
import { Link,Outlet } from "react-router";

const Document = () => {
  return (
    <>
    <div className="p-2 max-w-full h-screen ">
 
      <h1 className="text-2xl font-bold mb-6">📄 Document Section</h1>

      <div className="flex flex-row justify-start">

      {/* Navbar style links */}
      <nav className=" flex flex-col px-3 py-3 gap-3 w-1/5 h-[39rem] overflow-y-scroll">
        <Link to="/documents/upload" className="text-blue-600 hover:underline rounded  hover:bg-gray-500 hover:text-white">
          Upload Document
        </Link>
        <Link to="/documents/list" className="text-blue-600 hover:underline rounded hover:bg-gray-500 hover:text-white">
          List Documents
        </Link>
        <Link to="/documents/details" className="text-blue-600 hover:underline rounded hover:bg-gray-500 hover:text-white">
          Document Details
        </Link>
        <Link to="/documents/download" className="text-blue-600 hover:underline rounded hover:bg-gray-500 hover:text-white">
          Download Document
        </Link>
        <Link to="/documents/signature" className="text-blue-600 hover:underline rounded hover:bg-gray-500 hover:text-white">
          Sign Document
        </Link>
      </nav>
      <div className=" flex flex-col m-2 p-3">
              <Outlet />
      </div>
      </div>
    </div>
 
    </>
  );
};

export default Document;
