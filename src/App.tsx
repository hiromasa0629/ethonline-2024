import { useEffect } from "react";
import { useLitProtocol } from "./hooks/useLitProtocol";
import { useSignSchema } from "./hooks/useSignSchema";
import { useWeb3Auth } from "./hooks/useWeb3Auth";

function App() {
  const { user, handleLogIn, handleLogOut, isLoggedIn } = useWeb3Auth();
  const { createSchema } = useSignSchema();
  const { isReady, signMessage } = useLitProtocol();

  const testSign = async () => {
    const message = await signMessage("Hi");
    console.log(message);
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
              <button onClick={testSign} className="rounded bg-blue-200 p-2">
                Sign Message
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
