import React, { useEffect, useState } from "react";
import { listUsers } from "../../api/authApi.js";
import { createRoom } from "../../api/messageApi.js";
import Videobox from "./Videobox.jsx";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await listUsers();
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const startCall = async (userId) => {
    try {
      const { roomId } = await createRoom(); // ✅ use axios wrapper
      setRoomId(roomId);
      setActiveUser(userId);
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  const endCall = () => {
    setRoomId(null);
    setActiveUser(null);
  };

  return (
    <div className="w-1/2 p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Make a call to Users</h2>

      <ul className="space-y-3">
        {users.map((user) => (
          <li
            key={user._id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <span className="font-medium">{user.name}</span>
            {activeUser === user._id && roomId ? (
              <button
                onClick={endCall}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                End Call
              </button>
            ) : (
              <button
                onClick={() => startCall(user._id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Call
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Video call UI */}
      {roomId && (
  <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow">
    <Videobox roomId={roomId} />
  </div>
)}
    </div>
  );
};

export default UserList;
