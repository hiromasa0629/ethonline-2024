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
  const [sessionSignatures, setSessionSignatures] = useState<any>({
    "https://15.235.83.220:7470": {
      sig: "b210c76ced78b11a9613ed517c8187e05eb58fad665e2266820ffd87313fb76a6c0b1f39838313e743f48541b31efbc5f9698d9082c9320b2e41c7142ac1340a",
      derivedVia: "litSessionSignViaNacl",
      signedMessage:
        '{"sessionKey":"5e7f4e43aaebcd420c7b7b0195bad1a03cc10de214ed2a6d57876ace6b1d25f1","resourceAbilityRequests":[{"resource":{"resource":"*","resourcePrefix":"lit-pkp"},"ability":"pkp-signing"},{"resource":{"resource":"*","resourcePrefix":"lit-litaction"},"ability":"lit-action-execution"}],"capabilities":[{"sig":"{\\"ProofOfPossession\\":\\"8437e97412bf2f69ad883a230f54149f39100266f809b7597742c31fb95f26ad60a045a630edb776b867962bb36e6a811535be25103f371b306724b135765ee3423876758332868f4cc56112cf9e5511a9da8329c6d969f595b0c702c25b706a\\"}","algo":"LIT_BLS","derivedVia":"lit.bls","signedMessage":"localhost:5173 wants you to sign in with your Ethereum account:\\n0x517f9d8cAa597cAD0419f4816109BD66e722A3BD\\n\\nLit Protocol PKP session signature I further authorize the stated URI to perform the following actions on my behalf: I further authorize the stated URI to perform the following actions on my behalf: (1) \'Threshold\': \'Execution\' for \'lit-litaction://*\'. (2) \'Threshold\': \'Signing\' for \'lit-pkp://*\'. I further authorize the stated URI to perform the following actions on my behalf: (1) \'Threshold\': \'Execution\' for \'lit-litaction://*\'. (2) \'Threshold\': \'Signing\' for \'lit-pkp://*\'. (3) \'Auth\': \'Auth\' for \'lit-resolvedauthcontext://*\'.\\n\\nURI: lit:session:5e7f4e43aaebcd420c7b7b0195bad1a03cc10de214ed2a6d57876ace6b1d25f1\\nVersion: 1\\nChain ID: 1\\nNonce: 0xcfb9e981d5063ee76791cdcae1c65a59b70f3f9cbf1041f92def0d7f8acf81f6\\nIssued At: 2024-09-07T08:54:59Z\\nExpiration Time: 2024-10-07T08:55:05.685Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWxpdGFjdGlvbjovLyoiOnsiVGhyZXNob2xkL0V4ZWN1dGlvbiI6W3t9XX0sImxpdC1wa3A6Ly8qIjp7IlRocmVzaG9sZC9TaWduaW5nIjpbe31dfSwibGl0LXJlc29sdmVkYXV0aGNvbnRleHQ6Ly8qIjp7IkF1dGgvQXV0aCI6W3siYXV0aF9jb250ZXh0Ijp7ImFjdGlvbklwZnNJZHMiOltdLCJhdXRoTWV0aG9kQ29udGV4dHMiOlt7ImFwcElkIjoibGl0IiwiYXV0aE1ldGhvZFR5cGUiOjEsInVzZWRGb3JTaWduU2Vzc2lvbktleVJlcXVlc3QiOnRydWUsInVzZXJJZCI6IjB4REM0OTA5NjY2NTBGMTlhMjA0MGZCM2NEQjhlODVhMGU5QTc5OTRFMyJ9XSwiYXV0aFNpZ0FkZHJlc3MiOm51bGwsImN1c3RvbUF1dGhSZXNvdXJjZSI6IiIsInJlc291cmNlcyI6W119fV19fSwicHJmIjpbXX0","address":"0x517f9d8cAa597cAD0419f4816109BD66e722A3BD"}],"issuedAt":"2024-09-07T08:57:10.789Z","expiration":"2024-10-07T08:57:10.403Z","nodeAddress":"https://15.235.83.220:7470"}',
      address: "5e7f4e43aaebcd420c7b7b0195bad1a03cc10de214ed2a6d57876ace6b1d25f1",
      algo: "ed25519",
    },
    "https://15.235.83.220:7472": {
      sig: "9f4e190478f8d0991768f7ea34ce5e84d0d48aab83054a7446e16e2291fed0116d2c868325f81b75520751835e1d2d29760502086d5eb691e26c3063aff2260f",
      derivedVia: "litSessionSignViaNacl",
      signedMessage:
        '{"sessionKey":"5e7f4e43aaebcd420c7b7b0195bad1a03cc10de214ed2a6d57876ace6b1d25f1","resourceAbilityRequests":[{"resource":{"resource":"*","resourcePrefix":"lit-pkp"},"ability":"pkp-signing"},{"resource":{"resource":"*","resourcePrefix":"lit-litaction"},"ability":"lit-action-execution"}],"capabilities":[{"sig":"{\\"ProofOfPossession\\":\\"8437e97412bf2f69ad883a230f54149f39100266f809b7597742c31fb95f26ad60a045a630edb776b867962bb36e6a811535be25103f371b306724b135765ee3423876758332868f4cc56112cf9e5511a9da8329c6d969f595b0c702c25b706a\\"}","algo":"LIT_BLS","derivedVia":"lit.bls","signedMessage":"localhost:5173 wants you to sign in with your Ethereum account:\\n0x517f9d8cAa597cAD0419f4816109BD66e722A3BD\\n\\nLit Protocol PKP session signature I further authorize the stated URI to perform the following actions on my behalf: I further authorize the stated URI to perform the following actions on my behalf: (1) \'Threshold\': \'Execution\' for \'lit-litaction://*\'. (2) \'Threshold\': \'Signing\' for \'lit-pkp://*\'. I further authorize the stated URI to perform the following actions on my behalf: (1) \'Threshold\': \'Execution\' for \'lit-litaction://*\'. (2) \'Threshold\': \'Signing\' for \'lit-pkp://*\'. (3) \'Auth\': \'Auth\' for \'lit-resolvedauthcontext://*\'.\\n\\nURI: lit:session:5e7f4e43aaebcd420c7b7b0195bad1a03cc10de214ed2a6d57876ace6b1d25f1\\nVersion: 1\\nChain ID: 1\\nNonce: 0xcfb9e981d5063ee76791cdcae1c65a59b70f3f9cbf1041f92def0d7f8acf81f6\\nIssued At: 2024-09-07T08:54:59Z\\nExpiration Time: 2024-10-07T08:55:05.685Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWxpdGFjdGlvbjovLyoiOnsiVGhyZXNob2xkL0V4ZWN1dGlvbiI6W3t9XX0sImxpdC1wa3A6Ly8qIjp7IlRocmVzaG9sZC9TaWduaW5nIjpbe31dfSwibGl0LXJlc29sdmVkYXV0aGNvbnRleHQ6Ly8qIjp7IkF1dGgvQXV0aCI6W3siYXV0aF9jb250ZXh0Ijp7ImFjdGlvbklwZnNJZHMiOltdLCJhdXRoTWV0aG9kQ29udGV4dHMiOlt7ImFwcElkIjoibGl0IiwiYXV0aE1ldGhvZFR5cGUiOjEsInVzZWRGb3JTaWduU2Vzc2lvbktleVJlcXVlc3QiOnRydWUsInVzZXJJZCI6IjB4REM0OTA5NjY2NTBGMTlhMjA0MGZCM2NEQjhlODVhMGU5QTc5OTRFMyJ9XSwiYXV0aFNpZ0FkZHJlc3MiOm51bGwsImN1c3RvbUF1dGhSZXNvdXJjZSI6IiIsInJlc291cmNlcyI6W119fV19fSwicHJmIjpbXX0","address":"0x517f9d8cAa597cAD0419f4816109BD66e722A3BD"}],"issuedAt":"2024-09-07T08:57:10.789Z","expiration":"2024-10-07T08:57:10.403Z","nodeAddress":"https://15.235.83.220:7472"}',
      address: "5e7f4e43aaebcd420c7b7b0195bad1a03cc10de214ed2a6d57876ace6b1d25f1",
      algo: "ed25519",
    },
    "https://15.235.83.220:7471": {
      sig: "75ffae0b67c96863323b0daee05828c77d79f4a2475ac966b33f739c1db571e3d2ecf264c690ad8f2bdae705826adc01d600804707f0a6fa6a9bfa1677c3850e",
      derivedVia: "litSessionSignViaNacl",
      signedMessage:
        '{"sessionKey":"5e7f4e43aaebcd420c7b7b0195bad1a03cc10de214ed2a6d57876ace6b1d25f1","resourceAbilityRequests":[{"resource":{"resource":"*","resourcePrefix":"lit-pkp"},"ability":"pkp-signing"},{"resource":{"resource":"*","resourcePrefix":"lit-litaction"},"ability":"lit-action-execution"}],"capabilities":[{"sig":"{\\"ProofOfPossession\\":\\"8437e97412bf2f69ad883a230f54149f39100266f809b7597742c31fb95f26ad60a045a630edb776b867962bb36e6a811535be25103f371b306724b135765ee3423876758332868f4cc56112cf9e5511a9da8329c6d969f595b0c702c25b706a\\"}","algo":"LIT_BLS","derivedVia":"lit.bls","signedMessage":"localhost:5173 wants you to sign in with your Ethereum account:\\n0x517f9d8cAa597cAD0419f4816109BD66e722A3BD\\n\\nLit Protocol PKP session signature I further authorize the stated URI to perform the following actions on my behalf: I further authorize the stated URI to perform the following actions on my behalf: (1) \'Threshold\': \'Execution\' for \'lit-litaction://*\'. (2) \'Threshold\': \'Signing\' for \'lit-pkp://*\'. I further authorize the stated URI to perform the following actions on my behalf: (1) \'Threshold\': \'Execution\' for \'lit-litaction://*\'. (2) \'Threshold\': \'Signing\' for \'lit-pkp://*\'. (3) \'Auth\': \'Auth\' for \'lit-resolvedauthcontext://*\'.\\n\\nURI: lit:session:5e7f4e43aaebcd420c7b7b0195bad1a03cc10de214ed2a6d57876ace6b1d25f1\\nVersion: 1\\nChain ID: 1\\nNonce: 0xcfb9e981d5063ee76791cdcae1c65a59b70f3f9cbf1041f92def0d7f8acf81f6\\nIssued At: 2024-09-07T08:54:59Z\\nExpiration Time: 2024-10-07T08:55:05.685Z\\nResources:\\n- urn:recap:eyJhdHQiOnsibGl0LWxpdGFjdGlvbjovLyoiOnsiVGhyZXNob2xkL0V4ZWN1dGlvbiI6W3t9XX0sImxpdC1wa3A6Ly8qIjp7IlRocmVzaG9sZC9TaWduaW5nIjpbe31dfSwibGl0LXJlc29sdmVkYXV0aGNvbnRleHQ6Ly8qIjp7IkF1dGgvQXV0aCI6W3siYXV0aF9jb250ZXh0Ijp7ImFjdGlvbklwZnNJZHMiOltdLCJhdXRoTWV0aG9kQ29udGV4dHMiOlt7ImFwcElkIjoibGl0IiwiYXV0aE1ldGhvZFR5cGUiOjEsInVzZWRGb3JTaWduU2Vzc2lvbktleVJlcXVlc3QiOnRydWUsInVzZXJJZCI6IjB4REM0OTA5NjY2NTBGMTlhMjA0MGZCM2NEQjhlODVhMGU5QTc5OTRFMyJ9XSwiYXV0aFNpZ0FkZHJlc3MiOm51bGwsImN1c3RvbUF1dGhSZXNvdXJjZSI6IiIsInJlc291cmNlcyI6W119fV19fSwicHJmIjpbXX0","address":"0x517f9d8cAa597cAD0419f4816109BD66e722A3BD"}],"issuedAt":"2024-09-07T08:57:10.789Z","expiration":"2024-10-07T08:57:10.403Z","nodeAddress":"https://15.235.83.220:7471"}',
      address: "5e7f4e43aaebcd420c7b7b0195bad1a03cc10de214ed2a6d57876ace6b1d25f1",
      algo: "ed25519",
    },
  });
  const [privateKey, setPrivateKey] = useState({
    pkpAddress: "0x517f9d8cAa597cAD0419f4816109BD66e722A3BD",
    generatedPublicKey:
      "0x049a15576cb6e3986f27d97eda7e0d9c52de8e30c640a59ba9a6161e6759ce7bf2b46e01a2b7ed29f0aec6c1307c2fb35bc232dcd413ee93005a6e656f31eace27",
    id: "4beb6882-f26b-4691-8024-64af02cc088e",
  });
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
        {
          resource: new LitActionResource("*"),
          ability: LitAbility.LitActionExecution,
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

      const sessionSignatures = await litClient.getPkpSessionSigs({
        pkpPublicKey: pkp.publicKey!,
        authMethods: [authMethod],
        resourceAbilityRequests: [
          {
            resource: new LitPKPResource("*"),
            ability: LitAbility.PKPSigning,
          },
          {
            resource: new LitActionResource("*"),
            ability: LitAbility.LitActionExecution,
          },
        ],
        expiration: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
      });
      console.log({ sessionSignatures });
      setSessionSignatures(sessionSignatures);
      console.log("Session signature created");
    };
    connectPkpClient();
  }, [pkp, litClient, authMethod]);

  return (
    <LitProtocolContext.Provider
      value={{
        litClient,
        contractClient,
        pkp,
        pkpClient,
        authMethod,
        sessionSignatures,
        privateKey,
      }}
    >
      {children}
    </LitProtocolContext.Provider>
  );
};

export default LitProtocolProvider;
