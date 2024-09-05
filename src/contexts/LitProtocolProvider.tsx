/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useEffect, useState } from "react";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { LitNetwork, AuthMethodScope, AuthMethodType } from "@lit-protocol/constants";
import { LitProtocolContextType, PKP } from "../@types/lit";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import {
  LitAbility,
  LitAccessControlConditionResource,
  createSiweMessage,
  generateAuthSig,
  LitActionResource,
} from "@lit-protocol/auth-helpers";
import { PKPClient } from "@lit-protocol/pkp-client";
import RPC from "../utils/ethersRPC";
import { ethers } from "ethers";

export const LitProtocolContext = createContext<LitProtocolContextType | null>(null);

const LitProtocolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [litClient, setLitClient] = useState<LitNodeClient | undefined>();
  const [contractClient, setContractClient] = useState<LitContracts | undefined>();
  const [pkpClient, setPkpClient] = useState<PKPClient>();
  const [pkp, setPkp] = useState<PKP>();
  const [authMethod, setAuthMethod] = useState<{
    authMethodType: AuthMethodType;
    accessToken: string;
  }>();
  const { web3AuthProvider } = useWeb3Auth();

  useEffect(() => {
    const connectLit = async () => {
      if (!web3AuthProvider) return;
      const client = new LitNodeClient({
        litNetwork: LitNetwork.DatilDev,
      });
      await client.connect();
      setLitClient(client);
    };

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

      const authMethod = {
        authMethodType: AuthMethodType.EthWallet,
        accessToken: JSON.stringify(authSig),
      };

      setAuthMethod(authMethod);

      const mintInfo = await contractClient.mintWithAuth({
        authMethod: authMethod,
        scopes: [AuthMethodScope.SignAnything, AuthMethodScope.PersonalSign],
      });

      setPkp(mintInfo.pkp);
      setContractClient(contractClient);
    };

    if (litClient) {
      connectContract();
    }
  }, [litClient]);

  useEffect(() => {
    if (!pkp || !litClient || !authMethod) return;
    const connectPkpClient = async () => {
      const resourceAbilities = [
        {
          resource: new LitActionResource("*"),
          ability: LitAbility.PKPSigning,
        },
      ];

      const authNeededCallback = async (params: any) => {
        const response = await litClient.signSessionKey({
          statement: params.statement,
          authMethods: [authMethod],
          expiration: params.expiration,
          resources: params.resources,
          chainId: 1,
        });
        return response.authSig;
      };

      const pkpClient = new PKPClient({
        litNodeClient: litClient,
        authContext: {
          getSessionSigsProps: {
            chain: "ethereum",
            expiration: new Date(Date.now() + 60_000 * 60).toISOString(),
            resourceAbilityRequests: resourceAbilities,
            authNeededCallback,
          },
        },
        // controllerAuthSig: authSig,
        // controllerSessionSigs: sesionSigs, // (deprecated)
        pkpPubKey: pkp.publicKey,
      });
      setPkpClient(pkpClient);
      await pkpClient.connect();
    };
    connectPkpClient();
  }, [pkp, litClient, authMethod]);

  return (
    <LitProtocolContext.Provider value={{ litClient, contractClient, pkp, pkpClient }}>
      {children}
    </LitProtocolContext.Provider>
  );
};

export default LitProtocolProvider;
