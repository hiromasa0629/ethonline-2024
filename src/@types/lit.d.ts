import { LitContracts } from "@lit-protocol/contracts-sdk";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { PKPClient } from "@lit-protocol/pkp-client";
import { GeneratePrivateKeyResult } from "@lit-protocol/wrapped-keys";

export type PKP = {
  ethAddress: string;
  publicKey: string;
  tokenId: string;
};

export type LitProtocolContextType = {
  litClient?: LitNodeClient;
  contractClient?: LitContracts;
  pkp?: PKP;
  pkpClient?: PKPClient;
  authMethod?: {
    authMethodType: AuthMethodType;
    accessToken: string;
  };
  sessionSignatures?: Record<string, AuthSig>;
  privateKey?: GeneratePrivateKeyResult;
};
