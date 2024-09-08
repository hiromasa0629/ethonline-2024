import { gql } from "@apollo/client";

export const GET_COMPANIES = gql`
  query GetCompanies {
    ProofSchemaHook_SetCompany {
      id
      attester
      name
    }
  }
`;

export const GET_INSTITUTIONS = gql`
  query GetInstitutions {
    ProofSchemaHook_SetInstitution {
      attester
      name
    }
  }
`;

export const GET_ATTESTATION_ID = gql`
  query GetAttestationIds {
    ProofSchemaHook_AttestationId {
      txHash
      attestationId
    }
  }
`;
