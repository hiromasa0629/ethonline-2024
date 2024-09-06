import { useClient, useCanMessage, useSendMessage, useStartConversation } from "@xmtp/react-sdk";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { IProvider } from "@web3auth/base";
import ChatWindow from "../modules/chat/ChatWindow";
import ChatInput from "../modules/chat/ChatInput";
import BroadcasterDropdown from "../modules/chat/BroadcasterDropdown";

const Chat = () => {
  const { user, web3AuthProvider, isLoggedIn } = useWeb3Auth();
  const { error, isLoading, initialize } = useClient();
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [selectedBroadcaster, setSelectedBroadcaster] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [conversation, setConversation] = useState<any>();
  const { canMessage } = useCanMessage();
  const { sendMessage } = useSendMessage();
  const { startConversation } = useStartConversation();
  const ethersProvider = new ethers.providers.Web3Provider(web3AuthProvider as IProvider);

  const onSendMessage = async (text: any) => {
    await sendMessage(conversation, "message");
  };

  const handleSelectChange = async (e: any) => {
    setSelectedBroadcaster(e.target.value);
    const canMsg = await canMessage(e.target.value as string);
    setIsOnNetwork(canMsg);
    setMessages([]);
    if (canMsg) {
      const convo = await startConversation(
        e.target.value as string,
        "I would like to subscribe to this news letter!"
      );
      setConversation(convo.conversation);
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

  useEffect(() => {
    const temp = async () => {
      const opts = {
        // Only show messages from last hour
        startTime: new Date(new Date().getTime() - 60 * 60 * 1000), // 1 hour ago
        endTime: new Date(), // current time
      };
      if (conversation) {
        const msgs = await conversation.messages(opts);
        let msgList: any[] = [];
        console.log("msgs", msgs);
        msgs.reverse().map((msg: any, i: number) => {
          const pos = msg.length - i - 1;
          msgList.push({
            text: msg.content,
            senderAddress: msg.senderAddress,
            isUser: msg.senderAddress === user?.address,
          });
          console.log(msg.content);
        });

        setMessages(msgList);
      }
    };
    temp();
  }, [conversation]);

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
