import { createContext, useEffect, useState } from "react";
import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { SignProtocolContextType } from "../@types/sign";
import { createWalletClient, custom } from "viem";
import { baseSepolia } from "viem/chains";
import { useWeb3Auth } from "../hooks/useWeb3Auth";

export const SignProtocolContext = createContext<SignProtocolContextType | null>(null);

const SignProtocolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signClient, setSignClient] = useState<SignProtocolClient>();
  const { web3AuthProvider /* smartWallet */ } = useWeb3Auth();

  useEffect(() => {
    if (!web3AuthProvider) return;
    const wc = createWalletClient({
      chain: baseSepolia,
      transport: custom(web3AuthProvider),
    });
    setSignClient(
      new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.baseSepolia,
        walletClient: wc,
      })
    );
  }, [web3AuthProvider]);

  return (
    <SignProtocolContext.Provider value={{ signClient }}>{children}</SignProtocolContext.Provider>
  );
};

export default SignProtocolProvider;
