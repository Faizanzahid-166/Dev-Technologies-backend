import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageThunk } from "../../redux/chatSliceTunk/chatTunk.js";

const MessageInput = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  const { currentConversation } = useSelector((state) => state.chat);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;
    if (!currentConversation?._id) return;

    try {
      setLoading(true);

      await dispatch(
        sendMessageThunk({
          conversationId: currentConversation._id,
          text,
        })
      );

      setText("");

      // 🔥 keep focus like WhatsApp
      inputRef.current?.focus();
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={sendMessage}
      className="h-16 px-4 flex items-center gap-3 bg-[#f0f2f5]"
    >
      {/* Emoji */}
      <button
        type="button"
        className="text-gray-500 hover:text-gray-700 text-xl"
      >
        🙂
      </button>

      {/* Input */}
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          currentConversation ? "Type a message" : "Select a chat"
        }
        disabled={!currentConversation || loading}
        className="flex-1 px-4 py-2 rounded-full border border-gray-300
                   focus:outline-none focus:ring-2 focus:ring-green-400
                   disabled:bg-gray-100"
      />

      {/* Send */}
      <button
        type="submit"
        disabled={!text.trim() || loading}
        className={`px-4 py-2 rounded-full text-white transition
          ${
            text.trim() && !loading
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }
        `}
      >
        {loading ? "..." : "Send"}
      </button>
    </form>
  );
};

export default MessageInput;