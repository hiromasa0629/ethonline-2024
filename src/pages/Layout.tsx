import { Outlet } from "react-router-dom";
import { useSignSchema } from "../hooks/useSignSchema";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { LuHome } from "react-icons/lu";

function Layout() {
  const { user, handleLogIn, handleLogOut, isLoggedIn, isLoading: isLoginLoading } = useWeb3Auth();
  // const { createSchema } = useSignSchema();

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Outlet />
        </main>
        <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center justify-center gap-4">
              <button className="">
                <div className="text-3xl">
                  <LuHome />
                </div>
                <div>Home</div>
              </button>
              <button className="hover:text-gray-400">Profile</button>
              <button className="hover:text-gray-400">Settings</button>
              <button onClick={handleLogOut}>Logout</button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Layout;
