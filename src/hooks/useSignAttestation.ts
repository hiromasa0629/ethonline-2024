import { useContext } from "react";
import { SignProtocolContext } from "../contexts/SignProtocolProvider";
import { SignProtocolContextType } from "../@types/sign";
import { AttestationInfo } from "@ethsign/sp-sdk/dist/types/indexService";
import { Attestation, IndexService } from "@ethsign/sp-sdk";
import { decodeAbiParameters, encodeFunctionData, parseAbi } from "viem";
import { Web3AuthContext } from "../contexts/Web3AuthProvider";
import { Web3AuthContextType } from "../@types/user";
import { ethers } from "ethers";
import { PaymasterMode, UserOpResponse } from "@biconomy/account";
import { useFirestore } from "./useFirestore";

export const useSignAttestation = () => {
  const { signClient } = useContext(SignProtocolContext) as SignProtocolContextType;
  const { smartWallet } = useContext(Web3AuthContext) as Web3AuthContextType;
  const { addDocument } = useFirestore();

  const createEndorsementAttestation = async (signObject: Attestation) => {
    console.log("Creating attestation...");

    console.log([
      (signObject.data as any).endorsee_name,
      (signObject.data as any).endorser_name,
      (signObject.data as any).endorser_position,
      (signObject.data as any).endorser_text,
      (signObject.data as any).date_of_endorsement,
      (signObject.data as any).signature,
    ]);
    const encodedCall = encodeFunctionData({
      abi: parseAbi([
        "function attest((uint64,uint64,uint64,uint64,address,uint64,uint8,bool,bytes[],bytes),string,bytes,bytes)",
      ]),
      functionName: "attest",
      args: [
        [
          BigInt(signObject.schemaId),
          BigInt(0),
          BigInt(0),
          BigInt(0),
          signObject.attester as `0x${string}`,
          BigInt(0),
          0,
          false,
          signObject.recipients as `0x${string}`[],
          ethers.utils.defaultAbiCoder.encode(
            ["string", "string", "string", "string", "string", "string"],
            [
              (signObject.data as any).endorsee_name,
              (signObject.data as any).endorser_name,
              (signObject.data as any).endorser_position,
              (signObject.data as any).endorser_text,
              (signObject.data as any).date_of_endorsement,
              (signObject.data as any).signature,
            ]
          ) as `0x${string}`,
        ],
        signObject.recipients![0],
        "0x",
        "0x00",
      ],
    });

    const tx = {
      to: "0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD",
      data: encodedCall,
    };

    const { waitForTxHash } = (await smartWallet?.sendTransaction(tx, {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    })) as UserOpResponse;
    const { transactionHash, userOperationReceipt } = await waitForTxHash();

    console.log("Finish Attesting LFG");
    console.log(transactionHash, userOperationReceipt);

    const createdDoc = await addDocument(
      "attestations",
      {
        recipientName: (signObject.data as any).endorsee_name,
        recipientSwAddress: signObject.recipients![0],
        txHash: transactionHash,
        attestationType: "ENDORSEMENT",

        endorsement_endorser_name: (signObject.data as any).endorser_name,
        endorsement_endorser_address: signObject.attester as `0x${string}`,
        endorsement_endorser_position: (signObject.data as any).endorser_position,
        endorsement_details: (signObject.data as any).endorser_text,
      },
      transactionHash
    );

    console.log("Created attestation in db");
    console.log(createdDoc);
  };

  const createCertificateAttestation = async (signObject: Attestation) => {
    console.log("Creating attestation...");

    console.log([
      (signObject.data as any).university_name,
      (signObject.data as any).degree_title,
      (signObject.data as any).student_name,
      (signObject.data as any).student_id,
      (signObject.data as any).grade,
      (signObject.data as any).start_date,
      (signObject.data as any).end_date,
      (signObject.data as any).signature,
    ]);
    const encodedCall = encodeFunctionData({
      abi: parseAbi([
        "function attest((uint64,uint64,uint64,uint64,address,uint64,uint8,bool,bytes[],bytes),string,bytes,bytes)",
      ]),
      functionName: "attest",
      args: [
        [
          BigInt(signObject.schemaId),
          BigInt(0),
          BigInt(0),
          BigInt(0),
          signObject.attester as `0x${string}`,
          BigInt(0),
          0,
          false,
          signObject.recipients as `0x${string}`[],
          ethers.utils.defaultAbiCoder.encode(
            ["string", "string", "string", "string", "string", "string", "string", "string"],
            [
              (signObject.data as any).university_name,
              (signObject.data as any).degree_title,
              (signObject.data as any).student_name,
              (signObject.data as any).student_id,
              (signObject.data as any).grade,
              (signObject.data as any).start_date,
              (signObject.data as any).end_date,
              (signObject.data as any).signature,
            ]
          ) as `0x${string}`,
        ],
        signObject.recipients![0],
        "0x",
        ethers.utils.defaultAbiCoder.encode(
          ["address", "string"],
          [
            signObject.recipients![0] as `0x${string}`,
            "https://drive.google.com/file/d/18S7KMHBMfTWlo7ho3EbnfNim6pilRTpt/view?usp=sharing",
          ]
        ) as `0x${string}`,
      ],
    });

    const tx = {
      to: "0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD",
      data: encodedCall,
    };

    const { waitForTxHash } = (await smartWallet?.sendTransaction(tx, {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    })) as UserOpResponse;
    const { transactionHash, userOperationReceipt } = await waitForTxHash();

    console.log("Finish Attesting LFG");
    console.log(transactionHash, userOperationReceipt);

    const createdDoc = await addDocument(
      "attestations",
      {
        recipientName: (signObject.data as any).student_name,
        recipientSwAddress: signObject.recipients![0],
        txHash: transactionHash,
        attestationType: "CERTIFICATE",

        certificate_certifier_name: (signObject.data as any).university_name,
        certificate_certifier_address: signObject.attester,
        certificate_degree: (signObject.data as any).degree_title,
        certificate_grade: (signObject.data as any).grade,
        certificate_start_date: (signObject.data as any).start_date,
        certificate_end_date: (signObject.data as any).end_date,
      },
      transactionHash
    );

    console.log("Created attestation in db");
    console.log(createdDoc);
  };

  const createExperienceAttestation = async (signObject: Attestation) => {
    console.log("Creating attestation...");

    console.log([
      (signObject.data as any).company_name,
      (signObject.data as any).employee_name,
      (signObject.data as any).job_title,
      (signObject.data as any).supervisor_name,
      (signObject.data as any).supervisor_position,
      (signObject.data as any).supervisor_contact_info,
      (signObject.data as any).start_date,
      (signObject.data as any).end_date,
      (signObject.data as any).signature,
    ]);
    const encodedCall = encodeFunctionData({
      abi: parseAbi([
        "function attest((uint64,uint64,uint64,uint64,address,uint64,uint8,bool,bytes[],bytes),string,bytes,bytes)",
      ]),
      functionName: "attest",
      args: [
        [
          BigInt(signObject.schemaId),
          BigInt(0),
          BigInt(0),
          BigInt(0),
          signObject.attester as `0x${string}`,
          BigInt(0),
          0,
          false,
          signObject.recipients as `0x${string}`[],
          ethers.utils.defaultAbiCoder.encode(
            [
              "string",
              "string",
              "string",
              "string",
              "string",
              "string",
              "string",
              "string",
              "string",
            ],
            [
              (signObject.data as any).company_name,
              (signObject.data as any).employee_name,
              (signObject.data as any).job_title,
              (signObject.data as any).supervisor_name,
              (signObject.data as any).supervisor_position,
              (signObject.data as any).supervisor_contact_info,
              (signObject.data as any).start_date,
              (signObject.data as any).end_date,
              (signObject.data as any).signature,
            ]
          ) as `0x${string}`,
        ],
        signObject.recipients![0],
        "0x",
        "0x00",
      ],
    });

    const tx = {
      to: "0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD",
      data: encodedCall,
    };

    const { waitForTxHash } = (await smartWallet?.sendTransaction(tx, {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED },
    })) as UserOpResponse;
    const { transactionHash, userOperationReceipt } = await waitForTxHash();

    console.log("Finish Attesting LFG");
    console.log(transactionHash, userOperationReceipt);

    const createdDoc = await addDocument(
      "attestations",
      {
        recipientName: (signObject.data as any).employee_name,
        recipientSwAddress: signObject.recipients![0],
        txHash: transactionHash,
        attestationType: "EXPERIENCE",

        experience_company_name: (signObject.data as any).company_name,
        experience_company_address: signObject.attester,
        experience_position: (signObject.data as any).job_title,
        experience_start_date: (signObject.data as any).start_date,
        experience_end_date: (signObject.data as any).end_date,
      },
      transactionHash
    );

    console.log("Created attestation in db");
    console.log(createdDoc);
  };

  const parseAttestation = (attestation: AttestationInfo) => {
    const schema = attestation.schema;
    const data = decodeAbiParameters(schema.data, attestation.data as `0x${string}`);
    console.log(attestation);
    console.log(data);
  };

  const queryAttestation = async () => {
    const indexService = new IndexService("testnet");
    const res = await indexService.queryAttestationList({
      schemaId: "onchain_evm_84532_0xc4", // full schema id
      mode: "onchain",
      page: 1,
    });

    if (res && res.total > 0) {
      res.rows.forEach((attestation) => parseAttestation(attestation));
    }
  };

  return {
    createEndorsementAttestation,
    createCertificateAttestation,
    createExperienceAttestation,
    queryAttestation,
  };
};
