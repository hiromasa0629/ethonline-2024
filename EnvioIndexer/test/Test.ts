import assert from "assert";
import { 
  TestHelpers,
  ProofSchemaHook_Approval
} from "generated";
const { MockDb, ProofSchemaHook } = TestHelpers;

describe("ProofSchemaHook contract Approval event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for ProofSchemaHook contract Approval event
  const event = ProofSchemaHook.Approval.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("ProofSchemaHook_Approval is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await ProofSchemaHook.Approval.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualProofSchemaHookApproval = mockDbUpdated.entities.ProofSchemaHook_Approval.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedProofSchemaHookApproval: ProofSchemaHook_Approval = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      owner: event.params.owner,
      approved: event.params.approved,
      tokenId: event.params.tokenId,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualProofSchemaHookApproval, expectedProofSchemaHookApproval, "Actual ProofSchemaHookApproval should be the same as the expectedProofSchemaHookApproval");
  });
});
