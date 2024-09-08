import { useQuery } from "@apollo/client";
import { GET_ATTESTATION_ID } from "../graphql/queries";

export const useAttestationIds = () => {
  const { loading, error, data } = useQuery(GET_ATTESTATION_ID);

  const attestationIds: { attestationId: string; txHash: string }[] = [];

  if (data) {
    data.ProofSchemaHook_AttestationId.forEach((v: any) => {
      attestationIds.push({
        attestationId: Number(v.attestationId).toString(16).toLowerCase(),
        txHash: v.txHash,
      });
    });
  }

  return { loading, error, attestationIds };
};
