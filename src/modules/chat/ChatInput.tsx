// src/components/ChatInput.js
import React, { useState } from "react";

const ChatInput = ({ onSendMessage, disabled }: { onSendMessage: any; disabled: boolean }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex p-4 bg-white border-t border-gray-300">
      <input
        className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type your message..."
      />
      <button
        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
