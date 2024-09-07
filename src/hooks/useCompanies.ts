import { useQuery } from "@apollo/client";
import { GET_COMPANIES } from "../graphql/queries";

export const useCompanies = () => {
  const { loading, error, data } = useQuery(GET_COMPANIES);

  const companies: { name: string; companyAddress: string }[] = [];

  if (data) {
    data.ProofSchemaHook_SetCompany.forEach((v: any) => {
      companies.push({ name: v.name, companyAddress: v.attester });
    });
  }

  return { loading, error, companies };
};
