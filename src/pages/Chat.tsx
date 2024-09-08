import {
  useClient,
  useCanMessage,
  useSendMessage,
  useStartConversation,
  useStreamMessages,
  DecodedMessage,
} from "@xmtp/react-sdk";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { useCallback, useEffect, useState } from "react";

import ChatWindow from "../modules/chat/ChatWindow";
import ChatInput from "../modules/chat/ChatInput";
import { apiClient } from "../apis/apis";
import ChatList from "../modules/chat/ChatList";
import { useChat } from "../modules/chat/ChatContext";
import { BROADCASTER } from "../modules/chat/utils";

const Chat = () => {
  // Web3Auth stuff
  const { user } = useWeb3Auth();
  const { error, isLoading } = useClient();
  // XMTP stuff
  const { canMessage } = useCanMessage();
  const { sendMessage } = useSendMessage();
  const { startConversation } = useStartConversation();
  // my stuff
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [streamedMessages, setStreamedMessages] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any>();
  const { selectedChat, setSelectedChat } = useChat();

  // say no more.
  const onSendMessage = async (text: any) => {
    await sendMessage(conversation, text);
  };

  // When selecting a broadcaster see if broadcaster is available on network
  // and start a conversation
  const handleSelectChange = async () => {
    setStreamedMessages([]);
    const canMsg = await canMessage(selectedChat.eoaAddress as string);
    setIsOnNetwork(canMsg);
    if (canMsg) {
      if (Object.values(BROADCASTER).includes(selectedChat.eoaAddress)) {
        const convo = await startConversation(
          selectedChat.eoaAddress as string,
          "I would like to subscribe to this news letter!"
        );
        setConversation(convo.conversation);
        apiClient.post("/subscribe-to-broadcast", {
          senderAddress: user?.eoaAddress,
          receiverAddress: selectedChat.eoaAddress,
          message: "I would like to subscribe to this news letter!",
        });
        return;
      }
      const convo = await startConversation(selectedChat.eoaAddress as string, "Helloo.");
      setConversation(convo.conversation);
    }
    console.log(`${selectedChat.name} on network: ${canMsg}`);
  };

  useEffect(() => {
    if (selectedChat.eoaAddress === "") return;
    handleSelectChange();
  }, [selectedChat]);
  // Connect user to chat client

  // Set & Get messages if conversation has been established
  useEffect(() => {
    const temp = async () => {
      // const opts = {
      //   // Only show messages from last hour
      //   startTime: new Date(new Date().getTime() - 60 * 60 * 100), // 1 hour ago
      //   endTime: new Date(), // current time
      // };
      // use like below
      // const msgs = await conversation.messages(opts);
      if (conversation) {
        const msgs = await conversation.messages();
        setStreamedMessages(msgs);
      }
    };
    temp();
  }, [conversation]);

  // callback to handle incoming messages
  const onMessage = useCallback(
    (message: DecodedMessage) => {
      setStreamedMessages((prev) => [...prev, message]);
    },
    [streamedMessages]
  );

  useStreamMessages(conversation, { onMessage });
  if (selectedChat.eoaAddress === "") return <ChatList />;
  if (isOnNetwork === false)
    if (error) {
      return "An error occurred while initializing the client";
    }

  if (isLoading) {
    return "Awaiting signatures...";
  }

  return (
    <div className="flex flex-col h-[100%] max-h-screen bg-gray-100">
      <div className="flex items-center p-4 bg-white shadow-md">
        <button
          onClick={() => setSelectedChat({ name: "", eoaAddress: "" })} // Set to go back to ChatList
          className="mr-4 bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        >
          Back
        </button>
        <div className="flex items-center space-x-2">
          <p className="font-semibold text-lg text-gray-800">Chatting with: {selectedChat.name}</p>
          <span
            className={`w-3 h-3 rounded-full ${isOnNetwork ? "bg-green-500" : "bg-red-500"}`}
          ></span>
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-grow overflow-y-auto">
        <ChatWindow {...{ streamedMessages }} />
      </div>

      {/* Chat input */}
      <div className="relative">
        <div className="absolute bottom-[5.5rem] left-0 right-0">
          <ChatInput
            {...{ onSendMessage }}
            disabled={isOnNetwork}
            receiverAddress={selectedChat.eoaAddress}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
