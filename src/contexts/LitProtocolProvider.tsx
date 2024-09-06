/* eslint-disable @typescript-eslint/no-unused-vars */
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
  LitPKPResource,
} from "@lit-protocol/auth-helpers";
import { PKPClient } from "@lit-protocol/pkp-client";
import RPC from "../utils/ethersRPC";
import { ethers } from "ethers";

export const LitProtocolContext = createContext<LitProtocolContextType | null>(null);

const LitProtocolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [litClient, setLitClient] = useState<LitNodeClient | undefined>();
  const [contractClient, setContractClient] = useState<LitContracts | undefined>();
  const [pkpClient, setPkpClient] = useState<PKPClient>();
  const [pkp, setPkp] = useState<PKP>({
    tokenId: "0xb5b52d13b8f2ef5047f779aee3744717c5b42b3afe932187521927c68b45bbca",
    publicKey:
      "0483a00fecf237bbd9f37a1fb6694dce84d48b2504afe6f433211eb34d00cc48457e0439e88d00501c64d2ddfdace96d2a38c4959de2fb536bda3014771b9759a3",
    ethAddress: "0x517f9d8cAa597cAD0419f4816109BD66e722A3BD",
  });
  const [authMethod, setAuthMethod] = useState<{
    authMethodType: AuthMethodType;
    accessToken: string;
  }>({
    authMethodType: 1,
    accessToken:
      '{"sig":"0xc880565021d12c6c03cf95f51c2c4b0f47198962f2d9b3589e086ea8fde3142b3fff3279ab200956679128b215ddb1a95b41b4b06d9c05e3820ad4f21a3cdd5f1b","derivedVia":"web3.eth.personal.sign","signedMessage":"localhost wants you to sign in with your Ethereum account:\\n0xDC490966650F19a2040fB3cDB8e85a0e9A7994E3\\n\\nThis is a test statement.  You can put anything you want here. I further authorize the stated URI to perform the following actions on my behalf: (1) \'Threshold\': \'Decryption\' for \'lit-accesscontrolcondition://*\'.\\n\\nURI: http://localhost:5173\\nVersion: 1\\nChain ID: 1\\nNonce: 0x541ca0cd0e22e37fd1256da164113471788285da7e91aac74f639d2202391927\\nIssued At: 2024-09-05T04:01:12.567Z\\nExpiration Time: 2024-10-05T04:01:12.218Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWFjY2Vzc2NvbnRyb2xjb25kaXRpb246Ly8qIjp7IlRocmVzaG9sZC9EZWNyeXB0aW9uIjpbe31dfX0sInByZiI6W119","address":"0xDC490966650F19a2040fB3cDB8e85a0e9A7994E3"}',
  });
  const [sessionSignatures, setSessionSignatures] = useState<any>();
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

  // useEffect(() => {
  //   const connectContract = async () => {
  //     if (!web3AuthProvider) return;

  //     const ethersProvider = new ethers.providers.Web3Provider(web3AuthProvider);
  //     const signer = await ethersProvider.getSigner();
  //     const contractClient = new LitContracts({
  //       signer: signer,
  //       network: LitNetwork.DatilDev,
  //     });

  //     await contractClient.connect();
  //     setContractClient(contractClient);

  //     if (authMethod && pkp) return;
  //     const account = await RPC.getAccounts(web3AuthProvider);

  //     const toSign = await createSiweMessage({
  //       uri: "http://localhost:5173",
  //       expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
  //       resources: [
  //         {
  //           resource: new LitAccessControlConditionResource("*"),
  //           ability: LitAbility.AccessControlConditionDecryption,
  //         },
  //       ],
  //       walletAddress: account,
  //       nonce: await litClient!.getLatestBlockhash(),
  //       litNodeClient: litClient,
  //     });

  //     const authSig = await generateAuthSig({
  //       signer: signer,
  //       toSign,
  //     });

  //     const authMethodData = {
  //       authMethodType: AuthMethodType.EthWallet,
  //       accessToken: JSON.stringify(authSig),
  //     };

  //     setAuthMethod(authMethodData);

  //     const mintInfo = await contractClient.mintWithAuth({
  //       authMethod: authMethodData,
  //       scopes: [AuthMethodScope.SignAnything, AuthMethodScope.PersonalSign],
  //     });

  //     setPkp(mintInfo.pkp);
  //   };

  //   if (litClient) {
  //     connectContract();
  //   }
  // }, [litClient]);

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
        pkpPubKey: pkp.publicKey,
      });
      setPkpClient(pkpClient);
      await pkpClient.connect();
      console.log("PKP Client Connected");

      // const sessionSignatures = await litClient.getPkpSessionSigs({
      //   pkpPublicKey: pkp.publicKey!,
      //   authMethods: [authMethod],
      //   resourceAbilityRequests: [
      //     {
      //       resource: new LitPKPResource("*"),
      //       ability: LitAbility.PKPSigning,
      //     },
      //   ],
      //   expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      // });
      // setSessionSignatures(sessionSignatures);
      // console.log("Session signature created");
    };
    connectPkpClient();
  }, [pkp, litClient, authMethod]);

  return (
    <LitProtocolContext.Provider
      value={{ litClient, contractClient, pkp, pkpClient, authMethod, sessionSignatures }}
    >
      {children}
    </LitProtocolContext.Provider>
  );
};

export default LitProtocolProvider;
