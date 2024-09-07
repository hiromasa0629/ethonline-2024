import React, { createContext, useEffect, useState } from "react";
import { IUser, User, UserType, Web3AuthContextType } from "../@types/user";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import RPC from "../utils/ethersRPC";
import { APIs } from "../apis/apis";
import {
  createSmartAccountClient,
  BiconomySmartAccountV2,
  IPaymaster,
  createPaymaster,
} from "@biconomy/account";
import { ethers } from "ethers";
import { useFirestore } from "../hooks/useFirestore";

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

const biconomyConfig = {
  biconomyPaymasterApiKey: import.meta.env.VITE_BICONOMY_PAYMASTER_API_KEY,
  bundleUrl: `https://bundler.biconomy.io/api/v2/84532/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
};

console.log(biconomyConfig);

const web3AuthInstance = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

const institutionsAddress: `0x${string}`[] = ["0xdf53aBa401072CF0C02013dc459D45F84c3dE100"];
const companiesAddress: `0x${string}`[] = ["0xd6B912d181533d3881fe48860aEE941d80c05466"];

const Web3AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [web3Auth, _] = useState<Web3Auth>(web3AuthInstance);
  const [web3AuthProvider, setWeb3AuthProvider] = useState<IProvider | null>(null);
  const [web3AuthSigner, setWeb3AuthSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [smartWallet, setSmartWallet] = useState<BiconomySmartAccountV2>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { addDocument, findDocument, findAllDocumentsWhere } = useFirestore();

  //   const saveUser = (user: User | undefined) => {
  const saveUser = (user: any | undefined) => {
    setUser(user);
  };

  const saveWeb3AuthProvider = (provider: IProvider | null) => {
    if (!provider) return;
    setWeb3AuthProvider(provider);
  };

  const handleSetIsLoggedIn = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
  };

  const handleSetIsLoading = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };

  const postLoginFlow = async (provider: IProvider | null) => {
    if (web3Auth.connected && provider) {
      handleSetIsLoading(true);
      const user = await web3Auth.getUserInfo();
      const address = await RPC.getAccounts(provider);
      const userType: UserType = institutionsAddress.includes(address)
        ? "INSTITUTION"
        : companiesAddress.includes(address)
        ? "COMPANY"
        : "TALENT";

      const ethersProvider = new ethers.providers.Web3Provider(provider);
      setWeb3AuthSigner(ethersProvider.getSigner());

      const paymaster: IPaymaster = await createPaymaster({
        paymasterUrl: `https://paymaster.biconomy.io/api/v1/84532/${biconomyConfig.biconomyPaymasterApiKey}`,
        strictMode: false,
      });

      const sw = await createSmartAccountClient({
        signer: ethersProvider.getSigner(),
        biconomyPaymasterApiKey: biconomyConfig.biconomyPaymasterApiKey,
        // paymasterUrl: `https://paymaster.biconomy.io/api/v1/84532/${biconomyConfig.biconomyPaymasterApiKey}`,
        bundlerUrl: biconomyConfig.bundleUrl,
        paymaster: paymaster,
        rpcUrl: "https://base-sepolia-rpc.publicnode.com",
        chainId: 84532,
      });

      setSmartWallet(sw);

      const swAddress = await sw.getAccountAddress();

      if (user.email) {
        const u = await findDocument("users", user.email);
        console.log(u);
        if (u) saveUser(u);
        else {
          const res = await addDocument(
            "users",
            {
              name: user.name,
              email: user.email,
              eoaAddress: address,
              swAddress: swAddress,
              userType: userType,
            },
            user.email
          );
          saveUser(res.data);
        }
      } else {
        console.error("email undefined");
      }

      handleSetIsLoggedIn(true);
      handleSetIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (user) return;
      try {
        await web3Auth.initModal();
        const provider = await web3Auth.connect();
        saveWeb3AuthProvider(provider);
        await postLoginFlow(provider);
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
        isLoading,
        handleSetIsLoading,
        postLoginFlow,
        web3AuthSigner,
        smartWallet,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export default Web3AuthProvider;
