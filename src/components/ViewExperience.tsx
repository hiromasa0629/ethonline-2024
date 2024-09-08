import { useEffect, useState } from "react";
import { useAttestationIds } from "../hooks/useAttestationIds";

const ViewExperience = ({ attestations }: { attestations: any[] }) => {
  const [experienceAtt, setExperienceAtt] = useState<any[]>([]);
  const { attestationIds } = useAttestationIds();

  useEffect(() => {
    const filtered = attestations.filter((item) => item.attestationType === "EXPERIENCE");
    setExperienceAtt(filtered);
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
          <p className="text-4xl">Experience</p>
          <div className="w-full h-1 border bg-black/80 rounded-full" />
        </div>
        <p className="text-black/40 font-poppins">View your attested work experience here</p>
      </div>
      <div className="flex space-x-4 overflow-x-auto">
        {experienceAtt.length > 0 ? (
          experienceAtt.map((att: any, index: number) => {
            return (
              <div
                key={index}
                className="w-64 h-80 flex flex-col p-4 space-y-2 bg-white rounded-lg border-2 border-app-grey"
              >
                <div className="w-full flex flex-col flex-1 space-y-[6px]">
                  <p className="font-poppins text-sm">Attested By</p>
                  <p className="text-2xl">{att.experience_company_name.toUpperCase()}</p>
                  <div className="w-full h-[2px] rounded-full bg-black/80" />
                  <p className="text-xl">{att.experience_position}</p>
                  <p className="text-sm font-poppins text-black/50">
                    {att.experience_start_date} to {att.experience_end_date}
                  </p>
                </div>
                <button
                  className="w-full rounded-full bg-purple py-2"
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

export default ViewExperience;
