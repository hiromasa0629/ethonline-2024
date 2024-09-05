import { useContext } from "react";
import { LitProtocolContext } from "../contexts/LitProtocolProvider";
import { LitProtocolContextType } from "../@types/lit";

export const useLitProtocol = () => {
  const { litClient, contractClient, pkp, pkpClient } = useContext(
    LitProtocolContext
  ) as LitProtocolContextType;

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

  const isReady = litClient && contractClient && pkp && pkpClient;

  return {
    isReady,
    disconnectLitClient,
    signMessage,
  };
};
