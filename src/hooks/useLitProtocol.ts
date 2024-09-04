import { useContext } from "react";
import { LitProtocolContext } from "../contexts/LitProtocolProvider";
import { LitProtocolContextType } from "../@types/lit";

export const useLitProtocol = () => {
  const { litClient } = useContext(LitProtocolContext) as LitProtocolContextType;

  const disconnectLitClient = async () => {
    if (litClient) {
      await litClient.disconnect();
    }
  };

  return {
    disconnectLitClient,
  };
};
