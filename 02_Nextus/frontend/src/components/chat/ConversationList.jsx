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

        const name = conv.isGroup ? conv.name : otherUser?.name;

        const lastMsg = conv.lastMessage?.text || "No messages yet";

        const time = conv.lastMessage?.createdAt
          ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        return (
          <div
            key={conv._id}
            onClick={() => openConversation(conv)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition
              ${isActive ? "bg-[#e9edef]" : "hover:bg-[#f5f6f6]"}
            `}
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-[#00a884] text-white flex items-center justify-center font-semibold text-lg">
              {name?.charAt(0).toUpperCase()}
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0 border-b border-gray-100 pb-2">
              <div className="flex justify-between items-center">
                <p className="font-medium text-sm truncate text-gray-900">
                  {name}
                </p>

                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                  {time}
                </span>
              </div>

              <p className="text-sm text-gray-500 truncate mt-1">
                {lastMsg}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>

  );
};

export default ConversationList;
