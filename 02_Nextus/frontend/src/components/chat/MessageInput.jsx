// src/components/chat/MessageInput.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageThunk } from "../../redux/chatSliceTunk/chatTunk.js";

const MessageInput = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const { currentConversation } = useSelector((state) => state.chat);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    dispatch(
      sendMessageThunk({
        conversationId: currentConversation._id,
        text,
      })
    );

    setText("");
  };

  return (
    <form
      onSubmit={sendMessage}
      className="h-16 px-4 flex items-center gap-3 bg-[#f0f2f5]"
    >
      {/* Emoji / Attach (UI only) */}
      <button
        type="button"
        className="text-gray-500 hover:text-gray-700 text-xl"
      >
        🙂
      </button>

      {/* Input */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        className="flex-1 px-4 py-2 rounded-full border border-gray-300
                   focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      {/* Send */}
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
