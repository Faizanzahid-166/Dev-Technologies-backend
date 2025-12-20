import { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/Socketcontext.jsx";
import { getMessages, markMessagesAsRead } from "../../api/messageApi.js";
import { listUsers } from "../../api/authApi.js";

export default function ChatPage() {
  const { socket } = useSocket();
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations, setConversations] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const messagesEndRef = useRef(null);
  const normalizeId = (id) => (id ? id.toString() : "");

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Restore last selected user
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("chatUser"));
    if (savedUser) setSelectedUser(savedUser);
  }, []);

  // Save selected user
  useEffect(() => {
    if (selectedUser) localStorage.setItem("chatUser", JSON.stringify(selectedUser));
  }, [selectedUser]);

  // Fetch users
  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchUsers = async () => {
      try {
        const res = await listUsers();
        const usersArray = Array.isArray(res.data)
          ? res.data
          : res.data.users || res.data;

        setUsers(usersArray.filter(u => normalizeId(u._id) !== normalizeId(currentUser._id)));
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, [currentUser?._id]);

  // Fetch messages for selected user
  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      try {
        const msgs = await getMessages(selectedUser._id);
        setConversations(prev => ({
          ...prev,
          [normalizeId(selectedUser._id)]: msgs || [],
        }));
        await markMessagesAsRead(selectedUser._id);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !currentUser?._id) return;

    socket.on("online-users", setOnlineUsers);

    const handleNewMessage = (msg) => {
      const senderId = normalizeId(msg.sender?._id || msg.sender);
      const recipientId = normalizeId(msg.recipient?._id || msg.recipient);

      const chatUserId = senderId === normalizeId(currentUser._id) ? recipientId : senderId;

      setConversations(prev => {
        const conv = prev[chatUserId] || [];
        if (conv.some(m => m._id === msg._id)) return prev;
        return { ...prev, [chatUserId]: [...conv, msg] };
      });
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("online-users");
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, currentUser._id]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !socket) return;

    const recipientId = normalizeId(selectedUser._id);
    const msgData = { recipient: recipientId, content: newMessage, type: "text" };
    const tempMsg = { ...msgData, sender: normalizeId(currentUser._id), _id: `temp-${Date.now()}` };

    setConversations(prev => {
      const conv = prev[recipientId] || [];
      return { ...prev, [recipientId]: [...conv, tempMsg] };
    });

    setNewMessage("");

    socket.emit("send-message", msgData, (ack) => {
      if (!ack?.success) {
        console.error("Message send failed:", ack?.error);
        setConversations(prev => ({
          ...prev,
          [recipientId]: prev[recipientId].filter(m => m._id !== tempMsg._id)
        }));
      }
    });
  };

  const messages = selectedUser ? conversations[normalizeId(selectedUser._id)] || [] : [];
  const isUserOnline = (userId) => onlineUsers.map(normalizeId).includes(normalizeId(userId));

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 border-r bg-white flex flex-col">
        <div className="p-4 border-b font-bold text-lg">Chats</div>
        <div className="flex-1 overflow-y-auto">
          {users.map(u => (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)}
              className={`p-3 cursor-pointer hover:bg-gray-100 flex items-center gap-3 ${
                normalizeId(selectedUser?._id) === normalizeId(u._id) ? "bg-gray-200" : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isUserOnline(u._id) ? "bg-green-500" : "bg-gray-400"
                } text-white`}
              >
                {u.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-gray-500">{isUserOnline(u._id) ? "Online" : "Offline"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b flex items-center gap-3 bg-white">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isUserOnline(selectedUser._id) ? "bg-green-500" : "bg-gray-400"
                } text-white`}
              >
                {selectedUser.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-xs text-gray-500">{isUserOnline(selectedUser._id) ? "Online" : "Offline"}</p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
              {messages.map(msg => {
                const senderId = normalizeId(msg.sender?._id || msg.sender);
                const isMine = senderId === normalizeId(currentUser._id);

                return (
                  <div
                    key={msg._id}
                    className={`max-w-xs px-4 py-2 rounded-lg m-3 ${
                      isMine ? "bg-blue-600 text-white self-end ml-auto" : "bg-gray-200 text-gray-800 self-start"
                    }`}
                  >
                    {msg.content}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 border-t flex items-center gap-2 bg-white">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
