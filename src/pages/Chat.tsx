import {
  useClient,
  useCanMessage,
  useSendMessage,
  useStartConversation,
  useConversation,
} from "@xmtp/react-sdk";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { IProvider } from "@web3auth/base";
import ChatWindow from "../modules/chat/ChatWindow";
import ChatInput from "../modules/chat/ChatInput";
import BroadcasterDropdown from "../modules/chat/BroadcasterDropdown";

const Chat = () => {
  const { user, web3AuthProvider, isLoggedIn } = useWeb3Auth();
  const { client, error, isLoading, initialize } = useClient();
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [selectedBroadcaster, setSelectedBroadcaster] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [conversation, setConversation] = useState<any>();
  const { canMessage } = useCanMessage();
  const { sendMessage } = useSendMessage();
  // const { conversations } = useConversation();
  const { startConversation } = useStartConversation();
  const ethersProvider = new ethers.BrowserProvider(web3AuthProvider as IProvider);

  const onSendMessage = (text: any) => {
    // await sendMessage(conversation, message);
    setMessages([...messages, { text, isUser: true, messanger: user?.address as string }]);
  };

  const handleSelectChange = async (e: any) => {
    setSelectedBroadcaster(e.target.value);
    const canMsg = await canMessage(e.target.value as string);
    setIsOnNetwork(canMsg);
    if (canMsg) {
      const convo = await startConversation(
        e.target.value as string,
        "I would like to subscribe to this news letter!"
      );
      setConversation(convo);
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

  if (error) {
    return "An error occurred while initializing the client";
  }

  if (isLoading) {
    return "Awaiting signatures...";
  }
  console.log(isOnNetwork);
  return (
    <>
      <p>{user?.address}</p>
      <BroadcasterDropdown {...{ selectedBroadcaster, handleSelectChange, isOnNetwork }} />
      <ChatWindow {...{ messages }} />
      <ChatInput {...{ onSendMessage }} disabled={selectedBroadcaster !== "" ? true : false} />
    </>
  );
};

export default Chat;
