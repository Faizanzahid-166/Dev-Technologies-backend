// src/components/Meetings.jsx
import React, { useEffect, useState } from "react";
import {
  createMeeting,
  getMyMeetings,
  acceptMeeting,
  rejectMeeting,
  completeMeeting,
} from "../../api/meetingApi.js";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All"); // default tab
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: "",
    participants: "",
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const { data } = await getMyMeetings();
      setMeetings(data);
    } catch (err) {
      console.error("Error fetching meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const participantsArray = newMeeting.participants
        .split(",")
        .map((id) => ({ user: id.trim(), role: "investor" }));

      await createMeeting({ ...newMeeting, participants: participantsArray });
      setNewMeeting({ title: "", description: "", date: "", participants: "" });
      fetchMeetings();
    } catch (err) {
      console.error("Error creating meeting:", err);
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === "accept") await acceptMeeting(id);
      if (action === "reject") await rejectMeeting(id);
      if (action === "complete") await completeMeeting(id);
      fetchMeetings();
    } catch (err) {
      console.error("Error performing action:", err);
    }
  };

  if (loading) return <p>Loading meetings...</p>;

  // Filter meetings by tab
  const filteredMeetings =
    activeTab === "All"
      ? meetings
      : activeTab === "Pending"
      ? meetings.filter((m) =>
          m.participants.some((p) => p.response === "Pending")
        )
      : activeTab === "Accepted"
      ? meetings.filter((m) =>
          m.participants.some((p) => p.response === "Accepted")
        )
      : activeTab === "Rejected"
      ? meetings.filter((m) =>
          m.participants.some((p) => p.response === "Rejected")
        )
      : activeTab === "Completed"
      ? meetings.filter((m) => m.status === "Completed")
      : meetings;

  const tabs = ["All", "Pending", "Accepted", "Rejected", "Completed"];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white p-4 rounded mb-6 flex gap-4">
        <span className="font-bold">Meetings App</span>
        <span className="text-red-600 font-bold">Only Entrepreneur arranged the meeting</span>
        <button
          onClick={fetchMeetings}
          className="ml-auto bg-blue-500 px-3 py-1 rounded"
        >
          Refresh
        </button>
        
      </nav>

      <h1 className="text-2xl font-bold mb-4">Meetings</h1>

      {/* Horizontal Scroll Tabs */}
      <div className="overflow-x-auto mb-6">
        <div className="flex space-x-4 border-b pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Create Meeting Form */}
      <form
        onSubmit={handleCreate}
        className="space-y-3 border p-4 rounded mb-6"
      >
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={newMeeting.title}
          onChange={(e) =>
            setNewMeeting({ ...newMeeting, title: e.target.value })
          }
          required
        />
        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={newMeeting.description}
          onChange={(e) =>
            setNewMeeting({ ...newMeeting, description: e.target.value })
          }
        />
        <input
          type="datetime-local"
          className="w-full border p-2 rounded"
          value={newMeeting.date}
          onChange={(e) =>
            setNewMeeting({ ...newMeeting, date: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Participant IDs (comma separated)"
          className="w-full border p-2 rounded"
          value={newMeeting.participants}
          onChange={(e) =>
            setNewMeeting({ ...newMeeting, participants: e.target.value })
          }
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Meeting
        </button>
      </form>

      {/* Meetings List (Filtered by Tab) */}
      <div className="space-y-4">
        {filteredMeetings.length === 0 && (
          <p className="text-gray-500">No {activeTab} meetings found.</p>
        )}
        {filteredMeetings.map((m) => (
          <div key={m._id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{m.title}</h2>
            <p>{m.description}</p>
            <p>
              <strong>Date:</strong> {new Date(m.date).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {m.status}
            </p>

            {/* Participants */}
            <div className="mt-2">
              <strong>Participants:</strong>
              <ul className="list-disc list-inside">
                {m.participants.map((p) => (
                  <li key={`${m._id}-${p.user._id}`}>
                    {p.user.name} ({p.role}) — {p.response}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3">
              {m.status === "Scheduled" && (
                <>
                  <button
                    onClick={() => handleAction(m._id, "accept")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(m._id, "reject")}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </>
              )}
              {m.status === "Accepted" &&
                m.createdBy?._id === localStorage.getItem("userId") && (
                  <button
                    onClick={() => handleAction(m._id, "complete")}
                    className="bg-purple-500 text-white px-3 py-1 rounded"
                  >
                    Mark Complete
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
