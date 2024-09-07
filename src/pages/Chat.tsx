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
import { ethers } from "ethers";
import { IProvider } from "@web3auth/base";
import ChatWindow from "../modules/chat/ChatWindow";
import ChatInput from "../modules/chat/ChatInput";
import BroadcasterDropdown from "../modules/chat/BroadcasterDropdown";
import { apiClient } from "../apis/apis";

const Chat = () => {
  // Web3Auth stuff
  const { user, web3AuthProvider, isLoggedIn } = useWeb3Auth();
  const { error, isLoading, initialize } = useClient();
  // XMTP stuff
  const { canMessage } = useCanMessage();
  const { sendMessage } = useSendMessage();
  const { startConversation } = useStartConversation();
  // ethers stuff
  const ethersProvider = new ethers.providers.Web3Provider(web3AuthProvider as IProvider);
  // my stuff
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [selectedBroadcaster, setSelectedBroadcaster] = useState("");
  const [streamedMessages, setStreamedMessages] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any>();

  // say no more.
  const onSendMessage = async (text: any) => {
    await sendMessage(conversation, text);
  };

  // When selecting a broadcaster see if broadcaster is available on network
  // and start a conversation
  const handleSelectChange = async (e: any) => {
    setSelectedBroadcaster(e.target.value);
    setStreamedMessages([]);
    const canMsg = await canMessage(e.target.value as string);
    setIsOnNetwork(canMsg);
    if (canMsg) {
      const convo = await startConversation(
        e.target.value as string,
        "I would like to subscribe to this news letter!"
      );
      setConversation(convo.conversation);
      apiClient.post("/subscribe-to-broadcast", {
        senderAddress: user?.eoaAddress,
        receiverAddress: e.target.value,
        message: "I would like to subscribe to this news letter!",
      });
    }
  };

  // Connect user to chat client
  useEffect(() => {
    if (isLoggedIn) {
      const handleConnect = async () => {
        const options: any = {
          persistConversations: false,
          env: "dev",
        };
        const signer = await ethersProvider.getSigner();
        await initialize({ options, signer });
        // setIsOnNetwork(await canMessage(SUNWAY_ADDY));
      };
      handleConnect();
    }
  }, [isLoggedIn]);

  // Set & Get messages if conversation has been established
  useEffect(() => {
    const temp = async () => {
      const opts = {
        // Only show messages from last hour
        startTime: new Date(new Date().getTime() - 60 * 60 * 1000), // 1 hour ago
        endTime: new Date(), // current time
      };
      if (conversation) {
        const msgs = await conversation.messages(opts);
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

  if (error) {
    return "An error occurred while initializing the client";
  }

  if (isLoading) {
    return "Awaiting signatures...";
  }
  return (
    <div className="flex flex-col h-[100%] max-h-screen bg-gray-100">
      <p>{user?.eoaAddress}</p>
      <BroadcasterDropdown {...{ selectedBroadcaster, handleSelectChange, isOnNetwork }} />
      <div className="flex-grow overflow-y-auto">
        <ChatWindow {...{ streamedMessages }} />
      </div>
      <div className="relative">
        <div className="absolute bottom-0 left-0 right-0">
          <ChatInput
            {...{ onSendMessage }}
            disabled={isOnNetwork}
            receiverAddress={selectedBroadcaster}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
