import { useEffect, useState } from "react";
import { Link } from "react-router";
import { listUsers } from "../../api/authApi.js";

export default function Listofusers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await listUsers();
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Users</h2>
      <p className="text-red-600 font-bold">Only Entrepreneur arranged the meeting</p>
      <ul className="space-y-4">
        {users.map((u) => (
          <li
            key={u._id}
            className="flex items-center justify-between bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition"
          >
            <div>
              <p className="font-semibold text-lg text-gray-700">
                {u.name}{" "}
                <span className="text-sm text-gray-500">({u.role})</span>
              </p>
              <p className="text-sm text-gray-400">ID: {u._id}</p>
            </div>

            <div className="flex gap-2">
              <Link
                to="/messages/meetingArangment"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Schedule
              </Link>
              <Link
                to="/messages/chat"
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
              >
                Chat
              </Link>
              <Link
                to="/messages/videocall"
                className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition"
              >
              Video Call
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
