/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  ProofSchemaHook,
  ProofSchemaHook_Approval,
  ProofSchemaHook_ApprovalForAll,
  ProofSchemaHook_BatchMetadataUpdate,
  ProofSchemaHook_MetadataUpdate,
  ProofSchemaHook_OwnershipTransferred,
  ProofSchemaHook_SetCompany,
  ProofSchemaHook_SetInstitution,
  ProofSchemaHook_Transfer,
} from "generated";

ProofSchemaHook.Approval.handler(async ({ event, context }) => {
  const entity: ProofSchemaHook_Approval = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    approved: event.params.approved,
    tokenId: event.params.tokenId,
  };

  context.ProofSchemaHook_Approval.set(entity);
});

ProofSchemaHook.ApprovalForAll.handler(async ({ event, context }) => {
  const entity: ProofSchemaHook_ApprovalForAll = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    operator: event.params.operator,
    approved: event.params.approved,
  };

  context.ProofSchemaHook_ApprovalForAll.set(entity);
});

ProofSchemaHook.BatchMetadataUpdate.handler(async ({ event, context }) => {
  const entity: ProofSchemaHook_BatchMetadataUpdate = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    _fromTokenId: event.params._fromTokenId,
    _toTokenId: event.params._toTokenId,
  };

  context.ProofSchemaHook_BatchMetadataUpdate.set(entity);
});

ProofSchemaHook.MetadataUpdate.handler(async ({ event, context }) => {
  const entity: ProofSchemaHook_MetadataUpdate = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    _tokenId: event.params._tokenId,
  };

  context.ProofSchemaHook_MetadataUpdate.set(entity);
});

ProofSchemaHook.OwnershipTransferred.handler(async ({ event, context }) => {
  const entity: ProofSchemaHook_OwnershipTransferred = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    previousOwner: event.params.previousOwner,
    newOwner: event.params.newOwner,
  };

  context.ProofSchemaHook_OwnershipTransferred.set(entity);
});

ProofSchemaHook.SetCompany.handler(async ({ event, context }) => {
  const entity: ProofSchemaHook_SetCompany = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    attester: event.params.attester,
    name: event.params.name,
  };

  context.ProofSchemaHook_SetCompany.set(entity);
});

ProofSchemaHook.SetInstitution.handler(async ({ event, context }) => {
  const entity: ProofSchemaHook_SetInstitution = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    attester: event.params.attester,
    name: event.params.name,
  };

  context.ProofSchemaHook_SetInstitution.set(entity);
});

ProofSchemaHook.Transfer.handler(async ({ event, context }) => {
  const entity: ProofSchemaHook_Transfer = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    from: event.params.from,
    to: event.params.to,
    tokenId: event.params.tokenId,
  };

  context.ProofSchemaHook_Transfer.set(entity);
});
