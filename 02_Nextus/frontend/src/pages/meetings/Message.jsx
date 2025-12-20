import React from "react";
import { Link,Outlet } from "react-router";

const Messages = () => {
  return (
    <>
    <div className="p-2 max-w-full ">
 
      <h1 className="text-2xl font-bold mb-6">Start Chat</h1>

      <div className="flex flex-col justify-start">

      {/* Navbar style links */}
      <nav className=" flex flex-row px-3 py-3 gap-3 bg-gray-800">
        <Link to="/messages/meetingArangment" className="text-blue-600 hover:underline rounded  hover:bg-gray-500 hover:text-white">
          Meeting
        </Link>
        <Link to="/messages/videocall" className="text-blue-600 hover:underline rounded hover:bg-gray-500 hover:text-white">
        Videocall
        </Link>
        <Link to="/messages/chat" className="text-blue-600 hover:underline rounded hover:bg-gray-500 hover:text-white">
          Chat
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

export default Messages;
