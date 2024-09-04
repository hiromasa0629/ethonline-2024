import { useClient, useCanMessage } from "@xmtp/react-sdk";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { IProvider } from "@web3auth/base";

const SUNWAY_ADDY = "0xCddB21BC982A58E808b6e594de90aEE71f4D7152";

const Chat = () => {
  const { user, web3AuthProvider, isLoggedIn } = useWeb3Auth();
  const { client, error, isLoading, initialize } = useClient();
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const { canMessage } = useCanMessage();
  const ethersProvider = new ethers.BrowserProvider(web3AuthProvider as IProvider);

  useEffect(() => {
    if (isLoggedIn) {
      const handleConnect = async () => {
        const options: any = {
          persistConversations: false,
          env: "dev",
        };
        const signer = await ethersProvider.getSigner();
        await initialize({ options, signer });
        setIsOnNetwork(await canMessage(SUNWAY_ADDY));
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
      <p>Sunway Addy: {SUNWAY_ADDY}</p>
      <p>Available: {`${isOnNetwork}`}</p>
    </>
  );
};

export default Chat;
