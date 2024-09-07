import { GET_INSTITUTIONS } from "../graphql/queries";
import { useQuery } from "@apollo/client";

export const useInstitutions = () => {
  const { loading, error, data } = useQuery(GET_INSTITUTIONS);

  const institutions: { name: string; institutionAddress: string }[] = [];

  if (data) {
    data.ProofSchemaHook_SetInstitution.forEach((v: any) => {
      institutions.push({ name: v.name, institutionAddress: v.attester });
    });
  }

  return { loading, error, institutions };
};
