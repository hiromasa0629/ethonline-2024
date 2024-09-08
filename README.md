# Proof Protocol

## Getting Started

Install dependencies
```
npm i
```

Create `.env` following `.env.example`

Start `ngrok`
```
docker compose up -d
```

Start the application
```
npm run dev
```

## Envio

When calling Sign Protocol contract directly to create attestation, the attestation ID is not returned - only the transaction hash is received. Thus, HyperIndex is used to keep track of attestation IDs.

The contract and the events that we are keeping track of:
- Contract address: 0x07F82112c7D65F1e31Db6bd5E9492D743cEb2703 (Base Sepolia)
- Events:
  - AttestationId(uint64 indexed attestationId)
    - Keep track of attestation ids
  - AttestationNFTGiven(address indexed recipient, string uri)
    - Keep track of recipient's NFTs
  - SetCompany(address indexed attester, string name)
    - List of companies
  - SetInstitution(address indexed attester, string name)
    - List of institutions

### Event Handlers
The script defined how blockchain events are processed and indexed. Each event handler captures specific parameters from the events and stores them in the schema.

#### Example Handler
```
ProofSchemaHook.AttestationId.handler(async ({ event, context }) => {
  const entity: ProofSchemaHook_AttestationId = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    attestationId: event.params.attestationId,
    txHash: event.transaction.hash,
  };

  context.ProofSchemaHook_AttestationId.set(entity);
});
```

### Schema
The GraphQL schema lays out the structure of the data types used by the indexer. This includes identifiers, blockchain-specific data, and attestation details

#### Example Schema Definition
```
type ProofSchemaHook_AttestationId {
  id: ID!
  attestationId: BigInt!
  txHash: String!
}
```
