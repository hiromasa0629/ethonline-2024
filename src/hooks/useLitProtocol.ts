import { useContext } from "react";
import { LitProtocolContext } from "../contexts/LitProtocolProvider";
import { LitProtocolContextType } from "../@types/lit";
import { LitAbility, LitActionResource, LitPKPResource } from "@lit-protocol/auth-helpers";
import { zipAndEncryptString, decryptToString } from "@lit-protocol/lit-node-client";
import { api } from "@lit-protocol/wrapped-keys";
import { signMessageWithEncryptedKey } from "@lit-protocol/wrapped-keys/src/lib/api";
const { generatePrivateKey } = api;

export const useLitProtocol = () => {
  const { litClient, contractClient, pkp, privateKey, authMethod, sessionSignatures } = useContext(
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
          {
            resource: new LitActionResource("*"),
            ability: LitAbility.LitActionExecution,
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

  const genPrivKey = async () => {
    if (sessionSignatures && litClient) {
      const { pkpAddress, generatedPublicKey, id } = await generatePrivateKey({
        pkpSessionSigs: sessionSignatures,
        network: "evm",
        memo: "This is an arbitrary string you can replace with whatever you'd like",
        litNodeClient: litClient,
      });

      return {
        pkpAddress,
        generatedPublicKey,
        id,
      };
    }
  };

  const signMessage = async (message: string) => {
    if (sessionSignatures && privateKey && litClient) {
      const signature = await signMessageWithEncryptedKey({
        pkpSessionSigs: sessionSignatures,
        litNodeClient: litClient,
        network: "evm",
        id: privateKey.id,
        messageToSign: message,
      });
      return signature;
    }
  };

  // const isReady = litClient && contractClient && pkp && pkpClient;
  const isReady = litClient && pkp;

  return {
    isReady,
    disconnectLitClient,
    getPkpSessionSignatures,
    encrypt,
    decrypt,
    generateKey,
    genPrivKey,
    signMessage,
  };
};
