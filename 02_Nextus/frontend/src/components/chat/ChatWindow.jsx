import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MessageInput from "./MessageInput.jsx";

const ChatWindow = () => {
  const { messages, currentConversation } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.auth);

  const bottomRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Chat name
  const chatName = currentConversation?.isGroup
    ? currentConversation.name
    : currentConversation?.participants?.find(
        (p) => p._id !== user._id
      )?.name;

  // format time + day
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    let dayLabel = "";

    if (date.toDateString() === today.toDateString()) {
      dayLabel = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dayLabel = "Yesterday";
    } else {
      dayLabel = date.toLocaleDateString([], {
        weekday: "short",
      });
    }

    return `${dayLabel} • ${time}`;
  };

  return (
    <div className="flex flex-col flex-1 bg-[#efeae2]">

      {/* HEADER */}
      <div className="h-16 px-4 flex items-center gap-3 bg-white border-b">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
          {chatName?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div>
          <p className="font-medium">{chatName}</p>
          <p className="text-xs text-gray-500">online</p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">

        {messages.map((msg, idx) => {
          // FIX: sender normalization (VERY IMPORTANT)
          const senderId = msg.sender?._id || msg.sender;
          const isMe = senderId === user._id;

          const prev = messages[idx - 1];
          const isNewGroup =
            !prev || (prev.sender?._id || prev.sender) !== senderId;

          return (
            <div
              key={msg._id}
              className={`flex w-full ${
                isMe ? "justify-end" : "justify-start"
              } ${isNewGroup ? "mt-3" : "mt-1"}`}
            >

              {/* WRAPPER */}
              <div
                className={`flex flex-col max-w-[70%] ${
                  isMe ? "items-end" : "items-start"
                }`}
              >

                {/* BUBBLE */}
                <div
                  className={`relative px-3 py-2 text-sm shadow-sm break-words
                    w-fit min-w-[60px]
                    ${
                      isMe
                        ? "bg-[#d9fdd3] rounded-lg rounded-br-none"
                        : "bg-white rounded-lg rounded-bl-none"
                    }
                  `}
                >
                  {/* TEXT */}
                  <div className="pr-20 whitespace-pre-wrap">
                    {msg.text}
                  </div>

                  {/* TIME */}
                  <span className="absolute bottom-1 right-2 text-[10px] text-gray-400">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>

              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="bg-white border-t">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatWindow;