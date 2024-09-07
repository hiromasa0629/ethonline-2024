import { useEffect, useState } from "react";
import { useSignSchema } from "./hooks/useSignSchema";
import { useWeb3Auth } from "./hooks/useWeb3Auth";
import Login from "./pages/Login";
import AppRouter from "./router/AppRouter";
import { ethers } from "ethers";
import { IProvider } from "@web3auth/base";
import { useClient } from "@xmtp/react-sdk";

function App() {
  const { user, isLoggedIn, web3AuthProvider } = useWeb3Auth();
  const { initialize } = useClient();

  useEffect(() => {
    if (isLoggedIn) {
      const ethersProvider = new ethers.providers.Web3Provider(web3AuthProvider as IProvider);
      const handleConnect = async () => {
        const options: any = {
          persistConversations: false,
          env: "dev",
        };
        const signer = ethersProvider.getSigner();
        await initialize({ options, signer });
      };
      handleConnect();
    }
  }, [isLoggedIn]);

  return <>{isLoggedIn ? <AppRouter /> : <Login />}</>;
}

export default App;
