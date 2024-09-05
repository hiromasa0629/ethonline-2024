import { Outlet, useNavigate } from "react-router-dom";
import { useSignSchema } from "../hooks/useSignSchema";
import { useWeb3Auth } from "../hooks/useWeb3Auth";
import { LuHome, LuUser, LuSettings, LuLogOut } from "react-icons/lu";
import { IconType } from "react-icons";
import talentImg from "../assets/talent.png";
import schoolImg from "../assets/school.png";
import microscopeImg from "../assets/microscope.png";
import { IUser } from "../@types/user";
import { UserType } from "@prisma/client";

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
    TALENT: [
      { element: "home", icon: LuHome, action: () => navigate("/") },
      { element: "profile", icon: LuUser, action: () => navigate("/profile") },
      { element: "settings", icon: LuSettings, action: () => navigate("/settings") },
      { element: "logout", icon: LuLogOut, action: handleLogOut },
    ],
    INSTITUTION: [
      { element: "home", icon: LuHome, action: () => navigate("/") },
      { element: "profile", icon: LuUser, action: () => navigate("/profile") },
      { element: "settings", icon: LuSettings, action: () => navigate("/settings") },
      { element: "logout", icon: LuLogOut, action: handleLogOut },
    ],
    COMPANY: [
      { element: "home", icon: LuHome, action: () => navigate("/") },
      { element: "profile", icon: LuUser, action: () => navigate("/profile") },
      { element: "settings", icon: LuSettings, action: () => navigate("/settings") },
      { element: "logout", icon: LuLogOut, action: handleLogOut },
    ],
  };
  const buttons = user && user.userType ? buttonsConfig[user.userType] : [];

  return (
    <>
      <div className="flex flex-col overflow-y-scroll h-screen">
        <div className="w-full h-fit flex flex-col space-y-6 bg-purple rounded-b-2xl">
          {user && (
            <>
              {user.userType === UserType.TALENT ? (
                <TalentHeader user={user} />
              ) : user.userType === UserType.INSTITUTION ? (
                <InstitutionHeader user={user} />
              ) : (
                <CompanyHeader user={user} />
              )}
            </>
          )}
        </div>
        <div className="h-full overflow-y-auto">
          <Outlet />
        </div>
        <div>
          <footer className="w-full bottom-0 left-0 right-0 bg-purple text-white py-4 rounded-t-lg">
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
      </div>
    </>
  );
}

export default Layout;

interface HeaderProps {
  user: Partial<IUser>;
}

const TalentHeader: React.FC<HeaderProps> = (props) => {
  const { user } = props;

  if (!user) return "";

  return (
    <div className="w-full pt-5 flex items-end justify-around min-h-[150px]">
      <img src={talentImg} alt="talent-image" width={120} style={{ objectFit: "contain" }}></img>
      <div>
        <div>
          <span className="text-white">
            {user.address?.slice(0, 7)}...{user?.address?.slice(-5) || ""}
          </span>
        </div>
        <p className="text-4xl pb-2 text-white">
          <span className="text-yellow">HI,</span>
          <br />
          {user ? user.name?.toUpperCase() : "guest"}
        </p>
      </div>
    </div>
  );
};

const InstitutionHeader: React.FC<HeaderProps> = (props) => {
  const { user } = props;

  if (!user) return "";

  return (
    <div className="w-full pt-5 flex items-end justify-around min-h-[150px]">
      <img src={schoolImg} alt="talent-image" width={120} style={{ objectFit: "contain" }}></img>
      <div>
        <div>
          <span className="text-white">
            {user.address?.slice(0, 7)}...{user?.address?.slice(-5) || ""}
          </span>
        </div>
        <p className="text-4xl pb-2 text-white">
          <span className="text-yellow">HI,</span>
          <br />
          {user ? user.name?.toUpperCase() : "guest"}
        </p>
      </div>
    </div>
  );
};

const CompanyHeader: React.FC<HeaderProps> = (props) => {
  const { user } = props;

  if (!user) return "";

  return (
    <div className="w-full pt-5 flex items-end justify-around min-h-[150px]">
      <img
        src={microscopeImg}
        alt="talent-image"
        width={120}
        style={{ objectFit: "contain" }}
      ></img>
      <div>
        <div>
          <span className="text-white">
            {user.address?.slice(0, 7)}...{user?.address?.slice(-5) || ""}
          </span>
        </div>
        <p className="text-4xl pb-2 text-white">
          <span className="text-yellow">HI,</span>
          <br />
          {user ? user.name?.toUpperCase() : "guest"}
        </p>
      </div>
    </div>
  );
};
