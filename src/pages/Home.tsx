import { useWeb3Auth } from "../hooks/useWeb3Auth";
import talentImg from "../assets/talent.png";
import schoolImg from "../assets/school.png";
import microscopeImg from "../assets/microscope.png";
import { IUser } from "../@types/user";
import { UserType } from "@prisma/client";

const Home = () => {
  const { user } = useWeb3Auth();

  return (
    <>
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
      <div className="flex flex-col px-2 pt-2 pb-4 h-full space-y-4">
        <div className="space-y-2">
          <div>
            <span className="text-4xl">Education</span>
          </div>
          <div className="overflow-x-auto">
            <div className="flex w-fit space-x-4 pb-2">
              <div className="bg-white rounded-lg border-app-grey border-2 border-solid h-[220px] w-[270px]"></div>
              <div className="bg-white rounded-lg border-app-grey border-2 border-solid h-[220px] w-[270px]"></div>
              <div className="bg-white rounded-lg border-app-grey border-2 border-solid h-[220px] w-[270px]"></div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <span className="text-4xl">Working Experience</span>
          </div>
          <div className="overflow-x-auto">
            <div className="flex w-fit space-x-4 pb-2">
              <div className="bg-white rounded-lg border-app-grey border-2 border-solid h-[220px] w-[270px]"></div>
              <div className="bg-white rounded-lg border-app-grey border-2 border-solid h-[220px] w-[270px]"></div>
              <div className="bg-white rounded-lg border-app-grey border-2 border-solid h-[220px] w-[270px]"></div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <span className="text-4xl">Endorsement</span>
          </div>
          <div className="overflow-x-auto">
            <div className="flex w-fit space-x-4 pb-2">
              <div className="bg-white rounded-lg border-app-grey border-2 border-solid h-[220px] w-[270px]"></div>
              <div className="bg-white rounded-lg border-app-grey border-2 border-solid h-[220px] w-[270px]"></div>
              <div className="bg-white rounded-lg border-app-grey border-2 border-solid h-[220px] w-[270px]"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

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
