import { Outlet, useNavigate } from "react-router-dom";
import { useSignSchema } from "../hooks/useSignSchema";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { LuHome, LuUser, LuSettings, LuLogOut } from "react-icons/lu";
import { IconType } from "react-icons";

interface ButtonComponentProps {
  element: string;
  icon: IconType;
  onClickAction: () => void;
}

const ButtonComponent = ({ element, icon: Icon, onClickAction }: ButtonComponentProps) => {
  return (
    <button className="flex flex-col items-center justify-center" onClick={onClickAction}>
      <Icon className="text-3xl" />
      <p>{element.toUpperCase()}</p>
    </button>
  );
};

function Layout() {
  const { user, handleLogIn, handleLogOut, isLoggedIn, isLoading: isLoginLoading } = useWeb3Auth();
  const navigate = useNavigate();

  // Role-based button configurations
  const buttonsConfig = {
    talent: [
      { element: "home", icon: LuHome, action: () => navigate("/") },
      { element: "profile", icon: LuUser, action: () => navigate("/profile") },
      { element: "settings", icon: LuSettings, action: () => navigate("/settings") },
      { element: "logout", icon: LuLogOut, action: handleLogOut },
    ],
    organization: [],
  };
  const role = "talent";
  const buttons = buttonsConfig[role] || [];

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Outlet />
        </main>
        <footer className="fixed bottom-0 left-0 right-0 bg-[#6D6AD3] text-white py-4 w-screen">
          <div className="container mx-auto flex w-full justify-around items-center">
            {buttons.map((button, index) => (
              <ButtonComponent
                key={index}
                element={button.element}
                icon={button.icon}
                onClickAction={button.action}
              />
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}

export default Layout;
