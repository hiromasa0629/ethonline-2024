import { Outlet, useNavigate } from "react-router-dom";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import {
  LuHome,
  LuSearch,
  LuMessagesSquare,
  LuLogOut,
  LuCheckCircle2,
  LuFileBadge,
  LuHardHat,
} from "react-icons/lu";
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
  const { user, handleLogOut } = useWeb3Auth();
  const navigate = useNavigate();

  // Role-based button configurations
  const buttonsConfig = {
    TALENT: [
      { element: "home", icon: LuHome, action: () => navigate("/") },
      { element: "endorse", icon: LuCheckCircle2, action: () => navigate("/endorse") },
      { element: "chat", icon: LuMessagesSquare, action: () => navigate("/chat") },
      { element: "search", icon: LuSearch, action: () => navigate("/search") },
      { element: "logout", icon: LuLogOut, action: handleLogOut },
    ],
    INSTITUTION: [
      { element: "home", icon: LuHome, action: () => navigate("/") },
      { element: "certify", icon: LuFileBadge, action: () => navigate("/education") },
      { element: "chat", icon: LuMessagesSquare, action: () => navigate("/chat") },
      { element: "search", icon: LuSearch, action: () => navigate("/search") },
      { element: "logout", icon: LuLogOut, action: handleLogOut },
    ],
    COMPANY: [
      { element: "home", icon: LuHome, action: () => navigate("/") },
      { element: "work", icon: LuHardHat, action: () => navigate("/work-exp") },
      { element: "chat", icon: LuMessagesSquare, action: () => navigate("/chat") },
      { element: "search", icon: LuSearch, action: () => navigate("/search") },
      { element: "logout", icon: LuLogOut, action: handleLogOut },
    ],
  };
  const buttons = user && user.userType ? buttonsConfig[user.userType] : [];

  return (
    <>
      <div className="flex flex-col overflow-y-scroll h-screen bg-app-white">
        <Outlet />
        <footer className="fixed w-full bottom-0 left-0 bg-purple text-white py-4 rounded-t-lg">
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
