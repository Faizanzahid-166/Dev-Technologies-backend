// src/components/chat/ConversationList.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentConversation } from "../../redux/chatSliceTunk/chatSlice.js";
import { getConversationMessagesThunk } from "../../redux/chatSliceTunk/chatTunk.js";

const ConversationList = () => {
  const dispatch = useDispatch();
  const { conversations = [], loading, currentConversation } =
    useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const openConversation = (conversation) => {
    dispatch(setCurrentConversation(conversation));
    dispatch(getConversationMessagesThunk(conversation._id));
  };

  return (
    <div className="h-full bg-white flex flex-col">

      {/* Loading */}
      {loading && (
        <p className="p-4 text-sm text-gray-500">Loading chats...</p>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => {
          const otherUser = conv.participants.find(
            (p) => p._id !== user._id
          );

          const isActive = currentConversation?._id === conv._id;

          return (
            <div
              key={conv._id}
              onClick={() => openConversation(conv)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b
                ${isActive ? "bg-[#e9edef]" : "hover:bg-gray-100"}
              `}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                {(conv.isGroup ? conv.name : otherUser?.name)
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {conv.isGroup ? conv.name : otherUser?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {conv.lastMessage?.text || "No messages yet"}
                </p>
              </div>

              {/* Time / Badge (optional) */}
              <div className="text-xs text-gray-400">
                {conv.lastMessage?.createdAt
                  ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
