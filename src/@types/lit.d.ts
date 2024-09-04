import { LitContracts } from "@lit-protocol/contracts-sdk";
import { LitNodeClient } from "@lit-protocol/lit-node-client";

export type LitProtocolContextType = {
  litClient?: LitNodeClient;
  contractClient?: LitContracts;
};
