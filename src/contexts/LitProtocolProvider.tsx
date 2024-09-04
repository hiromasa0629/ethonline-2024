import { createContext, useEffect, useState } from "react";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { LitNetwork, AuthMethodScope, AuthMethodType } from "@lit-protocol/constants";
import { LitProtocolContextType } from "../@types/lit";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import {
  LitAbility,
  LitAccessControlConditionResource,
  createSiweMessage,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";
import RPC from "../utils/ethersRPC";
import { ethers } from "ethers";

export const LitProtocolContext = createContext<LitProtocolContextType | null>(null);

const LitProtocolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [litClient, setLitClient] = useState<LitNodeClient | undefined>();
  const [contractClient, setContractClient] = useState<LitContracts | undefined>();
  const { web3AuthProvider } = useWeb3Auth();

  useEffect(() => {
    const connectLit = async () => {
      if (!web3AuthProvider) return;
      const client = new LitNodeClient({
        litNetwork: LitNetwork.DatilDev,
      });
      await client.connect();
      setLitClient(client);
      console.log("Connected");
    };

    console.log("Start");
    connectLit();
  }, [web3AuthProvider]);

  useEffect(() => {
    const connectContract = async () => {
      if (!web3AuthProvider) return;

      const ethersProvider = new ethers.providers.Web3Provider(web3AuthProvider);
      const signer = await ethersProvider.getSigner();
      const contractClient = new LitContracts({
        signer: signer,
        network: LitNetwork.DatilDev,
      });

      await contractClient.connect();

      const account = await RPC.getAccounts(web3AuthProvider);

      // const sessionSignatures = await litClient!.getSessionSigs({
      //   chain: "ethereum",
      //   expiration: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 60 minutes
      //   resourceAbilityRequests: [
      //     {
      //       resource: new LitAccessControlConditionResource("*"),
      //       ability: LitAbility.AccessControlConditionDecryption,
      //     },
      //   ],
      //   authNeededCallback: async ({ uri, expiration, resourceAbilityRequests }) => {
      //     const toSign = await createSiweMessage({
      //       uri,
      //       expiration,
      //       resources: resourceAbilityRequests,
      //       walletAddress: account,
      //       nonce: await litClient!.getLatestBlockhash(),
      //       litNodeClient: litClient,
      //     });

      //     return await generateAuthSig({
      //       signer: signer,
      //       toSign,
      //     });
      //   },
      // });

      // console.log({ sessionSignatures });

      const toSign = await createSiweMessage({
        uri: "http://localhost:5173",
        expiration: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
        resources: [
          {
            resource: new LitAccessControlConditionResource("*"),
            ability: LitAbility.AccessControlConditionDecryption,
          },
        ],
        walletAddress: account,
        nonce: await litClient!.getLatestBlockhash(),
        litNodeClient: litClient,
      });

      const authSig = await generateAuthSig({
        signer: signer,
        toSign,
      });

      console.log({ authSig });
      const authMethod = {
        authMethodType: AuthMethodType.EthWallet,
        accessToken: JSON.stringify(authSig),
      };

      console.log({ authMethod });

      const mintInfo = await contractClient.mintWithAuth({
        authMethod: authMethod,
        scopes: [
          // AuthMethodScope.NoPermissions,
          AuthMethodScope.SignAnything,
          AuthMethodScope.PersonalSign,
        ],
      });

      console.log({ mintInfo });
      setContractClient(contractClient);
    };

    if (litClient) {
      connectContract();
    }
  }, [litClient]);

  return (
    <LitProtocolContext.Provider value={{ litClient, contractClient }}>
      {children}
    </LitProtocolContext.Provider>
  );
};

export default LitProtocolProvider;
