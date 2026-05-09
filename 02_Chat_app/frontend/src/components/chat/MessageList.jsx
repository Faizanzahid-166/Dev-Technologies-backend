import { useSelector } from "react-redux";

export default function MessageList() {
  const messages = useSelector((state) => state.chat.messages || []);
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#efeae2]">

      {messages.map((msg) => {
        const isMe =
          msg.sender === user._id ||
          msg.sender?._id === user._id;

        return (
          <div
            key={msg._id}
            className={`flex w-full ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            {/* BUBBLE WRAPPER */}
            <div
              className={`max-w-[70%] px-3 py-2 text-sm shadow-sm rounded-lg break-words
                ${
                  isMe
                    ? "bg-[#d9fdd3] rounded-br-none"
                    : "bg-white rounded-bl-none"
                }
              `}
            >
              {msg.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}