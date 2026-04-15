// src/components/chat/ChatWindow.jsx
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MessageInput from "./MessageInput.jsx";

const ChatWindow = () => {
  const { messages, currentConversation } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.auth);

  const bottomRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatName = currentConversation?.isGroup
    ? currentConversation.name
    : currentConversation?.participants?.find(
        (p) => p._id !== user._id
      )?.name;

  return (
    <div className="flex flex-col flex-1 bg-[#efeae2]">

      {/* Header */}
      <div className="h-16 px-4 flex items-center gap-3 bg-white border-b">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
          {chatName?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium">{chatName}</p>
          <p className="text-xs text-gray-500">online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.map((msg) => {
          const isMe = msg.sender === user._id;

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm shadow
                  ${
                    isMe
                      ? "bg-[#d9fdd3] text-gray-800 rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }
                `}
              >
                {msg.text}

                {/* Time */}
                <div className="text-[10px] text-gray-400 text-right mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatWindow;
