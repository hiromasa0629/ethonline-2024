/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLitProtocol } from "./hooks/useLitProtocol";
import { useSignSchema } from "./hooks/useSignSchema";
import { useWeb3Auth } from "./hooks/useWeb3Auth";

function App() {
  const { user, handleLogIn, handleLogOut, isLoggedIn } = useWeb3Auth();
  const { createSchema } = useSignSchema();
  const { isReady, signMessage } = useLitProtocol();

  const signAttestation = async (data: any) => {
    const signedAttestation = await signMessage(JSON.stringify(data));

    const attestationData = {
      ...data,
      signature: signedAttestation,
    };
    console.log({ attestationData });
  };

  return (
    <>
      <div className="h-screen flex flex-row justify-center items-center bg-white">
        {user && isLoggedIn ? (
          <div className="flex flex-col gap-2 justify-center items-center">
            <div>name: {user.name}</div>
            <div>address: {user.address}</div>
            <div>
              <button onClick={handleLogOut} className="rounded bg-blue-200 p-2">
                Log Out
              </button>
            </div>
            <div>
              <button onClick={createSchema} className="rounded bg-blue-200 p-2">
                Create Schema
              </button>
            </div>
            {isReady && (
              <button
                onClick={() =>
                  signAttestation({
                    endorsee_name: "Czer",
                    endorser_position: "Senior",
                    endorser_text: "Good job Czer",
                    endorsee_address: "0x69BaB2a02a84bfD3D68fd3E3963595b6E5Bf90De",
                    date_of_endorsement: "2024-09-07",
                  })
                }
                className="rounded bg-blue-200 p-2"
              >
                Sign Attestation
              </button>
            )}
          </div>
        ) : (
          <button onClick={handleLogIn}>Log In</button>
        )}
      </div>
    </>
  );
}

export default App;
