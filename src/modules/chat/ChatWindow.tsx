// src/components/ChatWindow.js

import { useEffect, useRef } from "react";
import { useWeb3Auth } from "../../hooks/useWeb3Auth";
import { useChat } from "./ChatContext";

const ChatWindow = ({ streamedMessages }: { streamedMessages: any[] }) => {
  const { user } = useWeb3Auth();
  const { selectedChat } = useChat();
  // Create a ref for the chat container
  const chatRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever new messages are added
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [streamedMessages]);
  return (
    <div
      ref={chatRef}
      className="flex flex-col p-4 space-y-4 overflow-y-auto h-[80%] max-h-[80%] bg-gray-100"
    >
      {streamedMessages.map((message: any, index: any) => (
        <div
          key={index}
          className={`max-w-xs break-words p-3 rounded-lg shadow ${
            user?.eoaAddress === message.senderAddress
              ? "bg-blue-500 text-white self-start"
              : "bg-gray-300 text-black self-end"
          }`}
        >
          <p className="text-xs">{message.senderAddress}</p>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
