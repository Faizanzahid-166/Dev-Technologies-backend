// src/pages/ChatPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyConversationsThunk } from "../../redux/chatSliceTunk/chatTunk.js";
import ConversationList from "../../components/chat/ConversationList.jsx";
import ChatWindow from "../../components/chat/ChatWindow.jsx";

function ChatPage() {
  const dispatch = useDispatch();
  const { currentConversation } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(getMyConversationsThunk());
  }, [dispatch]);

  return (
    <div className="h-screen flex bg-[#f0f2f5]">

      {/* LEFT: WhatsApp Sidebar */}
      <div className="w-full md:w-[30%] lg:w-[25%] bg-white border-r flex flex-col">

        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 bg-[#f0f2f5] border-b">
          <h2 className="font-semibold text-lg">Chats</h2>
          <button className="text-sm text-blue-600">New</button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          <ConversationList />
        </div>
      </div>

      {/* RIGHT: Chat Area */}
      <div className="hidden md:flex flex-1 flex-col">

        {currentConversation ? (
          <ChatWindow />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-[#efeae2]">
            <h3 className="text-xl font-medium mb-2">
              WhatsApp Web UI
            </h3>
            <p>Select a chat to start messaging</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default ChatPage;
