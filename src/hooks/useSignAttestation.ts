import { useContext } from "react";
import { SignProtocolContext } from "../contexts/SignProtocolProvider";
import { SignProtocolContextType } from "../@types/sign";
import { AttestationInfo } from "@ethsign/sp-sdk/dist/types/indexService";
import { Attestation, IndexService } from "@ethsign/sp-sdk";
import { decodeAbiParameters } from "viem";
import { Web3AuthContext } from "../contexts/Web3AuthProvider";
import { Web3AuthContextType } from "../@types/user";

export const useSignAttestation = () => {
  const { signClient } = useContext(SignProtocolContext) as SignProtocolContextType;
  const { smartWallet } = useContext(Web3AuthContext) as Web3AuthContextType;

  const createAttestation = async (signObject: Attestation) => {
    if (!signClient) return;
    console.log("Creating attestation...");
    console.log({ signClient });
    const res = await signClient.createAttestation(signObject);

    console.log("[Sign] Result:", res);
  };

  const parseAttestation = (attestation: AttestationInfo) => {
    const schema = attestation.schema;
    const data = decodeAbiParameters(schema.data, attestation.data as `0x${string}`);
    console.log(attestation);
    console.log(data);
  };

  const queryAttestation = async () => {
    const indexService = new IndexService("testnet");
    const res = await indexService.queryAttestationList({
      schemaId: "onchain_evm_84532_0xc4", // full schema id
      mode: "onchain",
      page: 1,
    });

    if (res && res.total > 0) {
      res.rows.forEach((attestation) => parseAttestation(attestation));
    }
  };

  return {
    createAttestation,
    queryAttestation,
  };
};
