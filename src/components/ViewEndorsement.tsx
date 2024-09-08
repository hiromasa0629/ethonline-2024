import { useEffect, useState } from "react";

const ViewEndorsement = ({ attestations }: { attestations: any[] }) => {
  const [endorsementAtt, setEndorsementAtt] = useState<any[]>([]);

  useEffect(() => {
    const filtered = attestations.filter((item) => item.attestationType === "ENDORSEMENT");
    setEndorsementAtt(filtered);
  }, [attestations]);

  return (
    <div className="w-full flex flex-col space-y-2">
      <div className="w-full flex flex-col">
        <div className="w-full flex items-center space-x-4">
          <p className="text-4xl">Endorsement</p>
          <div className="w-full h-1 border bg-black/80 rounded-full" />
        </div>
        <p className="text-black/40 font-poppins">View your attested endorsements here</p>
      </div>
      <div className="flex space-x-4 overflow-x-auto">
        {endorsementAtt.length > 0 ? (
          endorsementAtt.map((att: any, index: number) => {
            return (
              <div
                key={index}
                className="w-64 h-80 flex flex-col p-4 space-y-2 bg-white rounded-lg border-2 border-app-grey"
              >
                <div className="w-full flex flex-col flex-1 space-y-[6px]">
                  <p className="font-poppins text-sm">Endorsed By</p>
                  <p className="text-2xl">{att.endorsement_endorser_name.toUpperCase()}</p>
                  <div className="w-full h-[2px] rounded-full bg-black/80" />
                  <p className="text-lg">{att.endorsement_details}</p>
                </div>
                <button className="w-full rounded-full bg-yellow py-2">
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

export default ViewEndorsement;
