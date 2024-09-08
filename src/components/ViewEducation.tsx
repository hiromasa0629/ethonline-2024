import { useEffect, useState } from "react";
import { useAttestationIds } from "../hooks/useAttestationIds";

const ViewEducation = ({ attestations }: { attestations: any[] }) => {
  const [educationAtt, setEducationAtt] = useState<any[]>([]);
  const { attestationIds } = useAttestationIds();

  useEffect(() => {
    const filtered = attestations.filter((item) => item.attestationType === "CERTIFICATE");
    setEducationAtt(filtered);
  }, [attestations]);

  const handleClickButton = (txHash: string) => {
    const found = attestationIds.find((v) => v.txHash === txHash);
    if (!found) return;
    window.location.href = `https://testnet-scan.sign.global/attestation/onchain_evm_84532_0x${found.attestationId}`;
  };

  return (
    <div className="w-full flex flex-col space-y-2">
      <div className="w-full flex flex-col">
        <div className="w-full flex items-center space-x-4">
          <p className="text-4xl">Education</p>
          <div className="w-full h-1 border bg-black/80 rounded-full" />
        </div>
        <p className="text-black/40 font-poppins">View your attested education certificates here</p>
      </div>
      <div className="flex space-x-4 overflow-x-auto">
        {educationAtt.length > 0 ? (
          educationAtt.map((att: any, index: number) => {
            return (
              <div
                key={index}
                className="w-64 h-80 flex flex-col p-4 space-y-2 bg-white rounded-lg border-2 border-app-grey"
              >
                <div
                  onClick={() =>
                    (window.location.href =
                      "https://sepolia.basescan.org/tx/0x902c1f18a4e8704678d68dd36c4408e08f5fb86458550b31ffc5e8c3dcfbfb1c")
                  }
                  className="w-full flex flex-col flex-1 space-y-[6px]"
                >
                  <p className="font-poppins text-sm">Attested By</p>
                  <p className="text-2xl">{att.certificate_certifier_name.toUpperCase()}</p>
                  <div className="w-full h-[2px] rounded-full bg-black/80" />
                  <p className="text-xl">{att.certificate_degree}</p>
                  <p className="text-sm font-poppins text-black/50">
                    {att.certificate_start_date} to {att.certificate_end_date}
                  </p>
                  <p className="flex flex-grow items-end justify-end text-3xl text-black/70">
                    {att.certificate_grade}
                  </p>
                </div>
                <button
                  className="w-full rounded-full bg-yellow py-2"
                  onClick={() => handleClickButton(att.txHash)}
                >
                  <p>View transaction</p>
                </button>
              </div>
            );
          })
        ) : (
          <div className="w-full h-32 flex items-center justify-center text-black/50 text-xl font-poppins">
            No attestations found!
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEducation;
