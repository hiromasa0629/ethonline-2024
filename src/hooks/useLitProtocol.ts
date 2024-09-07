import { useContext } from "react";
import { LitProtocolContext } from "../contexts/LitProtocolProvider";
import { LitProtocolContextType } from "../@types/lit";
import { LitAbility, LitActionResource, LitPKPResource } from "@lit-protocol/auth-helpers";
import { zipAndEncryptString, decryptToString } from "@lit-protocol/lit-node-client";
import { api } from "@lit-protocol/wrapped-keys";
import { signMessageWithEncryptedKey } from "@lit-protocol/wrapped-keys/src/lib/api";
const { generatePrivateKey } = api;

export interface Endorsement {
  endorsee_name: string;
  endorser_name: string;
  endorser_position: string;
  endorser_text: string;
  date_of_endorsement: Date;
  signature?: string;
}

export interface WorkExperience {
  company_name: string;
  employee_name: string;
  job_title: string;
  supervisor_name: string;
  supervisor_position: string;
  supervisor_contact_info: string;
  start_date: Date;
  end_date: Date;
  signature?: string;
}

export interface Education {
  university_name: string;
  degree_title: string;
  student_name: string;
  student_id: string;
  grade: string;
  start_date: Date;
  end_date: Date;
  signature: string;
}

export const useLitProtocol = () => {
  const { litClient, authMethod, sessionSignatures } = useContext(
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
    if (litClient && authMethod) {
      const sessionSignatures = await litClient.getPkpSessionSigs({
        pkpPublicKey: import.meta.env.VITE_PKP_PUBLIC_KEY,
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
    if (sessionSignatures && litClient) {
      const signature = await signMessageWithEncryptedKey({
        pkpSessionSigs: sessionSignatures,
        litNodeClient: litClient,
        network: "evm",
        id: import.meta.env.VITE_WRAPPED_KEY_ID,
        messageToSign: message,
      });
      return signature;
    }
  };

  const signEndorsement = async (data: Endorsement) => {
    const signedAttestation = await signMessage(JSON.stringify(data));

    const attestationData = {
      ...data,
      signature: signedAttestation,
    };
    return attestationData;
  };

  const signWorkExperience = async (data: WorkExperience) => {
    const signedAttestation = await signMessage(JSON.stringify(data));

    const attestationData = {
      ...data,
      signature: signedAttestation,
    };
    return attestationData;
  };

  const signEducation = async (data: Education) => {
    const signedAttestation = await signMessage(JSON.stringify(data));

    const attestationData = {
      ...data,
      signature: signedAttestation,
    };
    return attestationData;
  };

  const isReady = litClient && sessionSignatures;

  return {
    isReady,
    disconnectLitClient,
    getPkpSessionSignatures,
    encrypt,
    decrypt,
    generateKey,
    genPrivKey,
    signMessage,
    signEndorsement,
    signWorkExperience,
    signEducation,
  };
};
