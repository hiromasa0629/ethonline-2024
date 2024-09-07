// src/components/ChatInput.js
import React, { useState } from "react";
import { apiClient } from "../../apis/apis";
import { useWeb3Auth } from "../../hooks/useWeb3Auth";

const ChatInput = ({
  onSendMessage,
  disabled,
  receiverAddress,
}: {
  onSendMessage: any;
  disabled: boolean;
  receiverAddress: any;
}) => {
  const [input, setInput] = useState("");
  const { user } = useWeb3Auth();

  const handleSend = async () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
      apiClient.post("/subscribe-to-broadcast", {
        senderAddress: user?.eoaAddress,
        receiverAddress: receiverAddress,
        message: input,
      });
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
        disabled={disabled}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
