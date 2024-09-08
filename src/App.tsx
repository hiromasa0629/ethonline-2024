/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import { useWeb3Auth } from "./hooks/useWeb3Auth";
import Login from "./pages/Login";
import AppRouter from "./router/AppRouter";
import { ethers } from "ethers";
import { IProvider } from "@web3auth/base";
import { Client, useClient, useDb } from "@xmtp/react-sdk";
import { loadKeys, storeKeys } from "./modules/chat/utils";

function App() {
  const { isLoggedIn, web3AuthProvider } = useWeb3Auth();
  const { initialize, disconnect } = useClient();
  const { clearCache } = useDb();

  useEffect(() => {
    if (isLoggedIn) {
      const handleConnect = async () => {
        const ethersProvider = new ethers.providers.Web3Provider(web3AuthProvider as IProvider);
        const options: any = {
          persistConversations: false,
          env: "dev",
        };
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();
        let keys = loadKeys(address);
        if (!keys) {
          keys = await Client.getKeys(signer, {
            ...options,
            skipContactPublishing: true,
            persistConversations: false,
          });
          storeKeys(address, keys);
        }
        await initialize({ keys, options, signer });
      };
      handleConnect();
    } else {
      disconnect();
      clearCache();
    }
  }, [isLoggedIn]);

  return <>{isLoggedIn ? <AppRouter /> : <Login />}</>;
}

export default App;
