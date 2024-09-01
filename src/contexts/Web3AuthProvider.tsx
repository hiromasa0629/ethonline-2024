import React, { createContext, useEffect, useState } from "react";
import { IUser, Web3AuthContextType } from "../@types/user";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import RPC from "../utils/ethersRPC";

const clientId =
  "BPOFE71BSG2ocdV7zJCLiiWDrBaTjlTg0iEA1FUKO9ONkj-ik8P9lDQl4mSLzstn8t1I30bqWvi5HUPKZoLuvUg";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x14a34",
  rpcTarget: "https://base-sepolia-rpc.publicnode.com",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Base Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.basescan.org",
  ticker: "ETH",
  tickerName: "Ethereum",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

export const Web3AuthContext = createContext<Web3AuthContextType | null>(null);

const Web3AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Partial<IUser>>();
  const [web3Auth, _] = useState<Web3Auth>(
    new Web3Auth({
      clientId,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      privateKeyProvider,
    })
  );
  const [web3AuthProvider, setWeb3AuthProvider] = useState<IProvider | null>(
    null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const saveUser = (user: Partial<IUser> | undefined) => {
    setUser(user);
  };

  const saveWeb3AuthProvider = (provider: IProvider | null) => {
    setWeb3AuthProvider(provider);
  };

  const handleSetIsLoggedIn = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
  };

  useEffect(() => {
    const init = async () => {
      if (user) return;
      try {
        await web3Auth.initModal();
        saveWeb3AuthProvider(web3Auth.provider);

        if (web3Auth.connected && web3Auth.provider) {
          const user = await web3Auth.getUserInfo();
          const address = await RPC.getAccounts(web3Auth.provider);
          saveUser({ ...user, address });
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  return (
    <Web3AuthContext.Provider
      value={{
        user,
        saveUser,
        web3Auth,
        web3AuthProvider,
        saveWeb3AuthProvider,
        isLoggedIn,
        handleSetIsLoggedIn,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export default Web3AuthProvider;
