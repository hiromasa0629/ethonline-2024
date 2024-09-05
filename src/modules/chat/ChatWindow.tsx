// src/components/ChatWindow.js
import React from "react";

const ChatWindow = ({ messages }: { messages: any }) => {
  return (
    <div className="flex flex-col p-4 space-y-4 overflow-y-auto h-full bg-gray-100">
      {messages.map((message: any, index: any) => (
        <div
          key={index}
          className={`max-w-xs break-words p-3 rounded-lg shadow ${
            message.isUser
              ? "bg-blue-500 text-white self-start"
              : "bg-gray-300 text-black  self-end"
          }`}
        >
          <p className="text-xs">{message.messanger}</p>
          <p>{message.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
