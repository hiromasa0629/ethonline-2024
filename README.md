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

## XMTP Integration for Communication

### Overview

This project leverages the XMTP to facilitate decentralized communication between talents and companies/institutions. With XMTP, talents can directly chat with companies/institutions or subscribe to their newsletter, while companies/institutions can broadcast messages to subscribed talents. The goal is to create a seamless, privacy-first communication experience for both parties within the decentralized web3 ecosystem.

### Features
- **Private Messaging**: Talents and companies can engage in secure, end-to-end encrypted conversations.
- **Broadcasting**: Companies and institutions can send announcements or broadcast updates to all talents who have subscribed to their channels.
- **Decentralized Protocol**: All messages are decentralized, ensuring privacy and ownership of data.
- **Automated Response**: Subscription channel for companies and institution will also have the ability to customized response messages to Talents enquiry.

### Use Cases

1. **Talent Engagement**: Talents can chat with potential employers directly, ask questions, and discuss opportunities.
2. **Company Announcements**: Companies and Institutions can broadcast important updates or job postings to all subscribed talents in one go.
3. **Subscription-Based Messaging**: Talents can choose which companies or institutions they wish to subscribe to, receiving messages only from those they are interested in.