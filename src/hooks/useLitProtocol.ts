import { useContext } from "react";
import { LitProtocolContext } from "../contexts/LitProtocolProvider";
import { LitProtocolContextType } from "../@types/lit";
import { LitAbility, LitPKPResource } from "@lit-protocol/auth-helpers";
import { zipAndEncryptString, decryptToString } from "@lit-protocol/lit-node-client";
import { api } from "@lit-protocol/wrapped-keys";
const { generatePrivateKey } = api;

export const useLitProtocol = () => {
  const { litClient, contractClient, pkp, pkpClient, authMethod, sessionSignatures } = useContext(
    LitProtocolContext
  ) as LitProtocolContextType;
  const unifiedAccessControlConditions = [
    {
      conditionType: "evmBasic",
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: ">=",
        value: "10000000000000",
      },
    },
  ];
  const chain = "ethereum";

  const disconnectLitClient = async () => {
    if (litClient) {
      await litClient.disconnect();
    }
  };

  const signMessage = async (message: string | Uint8Array): Promise<string | undefined> => {
    if (contractClient) {
      return await contractClient.signer.signMessage(message);
    }
  };

  const getPkpSessionSignatures = async () => {
    if (litClient && pkp && authMethod) {
      const sessionSignatures = await litClient.getPkpSessionSigs({
        pkpPublicKey: pkp.publicKey!,
        authMethods: [authMethod],
        resourceAbilityRequests: [
          {
            resource: new LitPKPResource("*"),
            ability: LitAbility.PKPSigning,
          },
        ],
        expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      });
      return sessionSignatures;
    }
  };

  const generateKey = async () => {
    if (litClient && sessionSignatures) {
      const { pkpAddress, generatedPublicKey } = await generatePrivateKey({
        pkpSessionSigs: sessionSignatures,
        network: "evm",
        memo: "This is an arbitrary string you can replace with whatever you'd like",
        litNodeClient: litClient,
      });
      return {
        pkpAddress,
        generatedPublicKey,
      };
    }
  };

  const encrypt = async (data: string) => {
    if (litClient) {
      const { ciphertext, dataToEncryptHash } = await zipAndEncryptString(
        {
          unifiedAccessControlConditions,
          dataToEncrypt: data,
        },
        litClient
      );
      return {
        ciphertext,
        dataToEncryptHash,
      };
    }
  };

  const decrypt = async (data: { ciphertext: string; dataToEncryptHash: string }) => {
    if (litClient) {
      const { ciphertext, dataToEncryptHash } = data;
      const decryptedData = await decryptToString(
        {
          ciphertext,
          dataToEncryptHash,
          chain,
        },
        litClient
      );
      return decryptedData;
    }
  };

  // const isReady = litClient && contractClient && pkp && pkpClient;
  const isReady = litClient && pkp;

  return {
    isReady,
    disconnectLitClient,
    signMessage,
    getPkpSessionSignatures,
    encrypt,
    decrypt,
    generateKey,
  };
};
