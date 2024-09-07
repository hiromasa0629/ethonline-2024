import { useWeb3Auth } from "../hooks/useWeb3Auth";
import talentImg from "../assets/talent.png";
import schoolImg from "../assets/school.png";
import microscopeImg from "../assets/microscope.png";
import { IUser, User } from "../@types/user";
import { useEffect, useState } from "react";
import { useFirestore } from "../hooks/useFirestore";
import ViewEducation from "../components/ViewEducation";
import ViewEndorsement from "../components/ViewEndorsement";
import ViewExperience from "../components/ViewExperience";
import { useQuery } from "@apollo/client";
import { GET_COMPANIES } from "../graphql/queries";
import { useCompanies } from "../hooks/useCompanies";
import { useInstitutions } from "../hooks/useInstitutions";

const Home = () => {
  const { user } = useWeb3Auth();
  const [attestations, setAttestations] = useState<any[]>([]);
  const { findAllDocumentsWhere } = useFirestore();
  const { companies } = useCompanies();
  const { institutions } = useInstitutions();

  console.log({ companies });
  console.log({ institutions });

  useEffect(() => {
    const getAttestations = async () => {
      const result = await findAllDocumentsWhere(
        "attestations",
        "recipientSwAddress",
        user!.swAddress
      );
      console.log("[Home] Firestore find all returns:", result);
      setAttestations(result);
    };

    getAttestations();
  }, []);

  return (
    <>
      <div className="w-full h-fit flex flex-col space-y-6 bg-purple rounded-b-2xl">
        {user && (
          <>
            {user.userType === "TALENT" ? (
              <TalentHeader user={user} />
            ) : user.userType === "INSTITUTION" ? (
              <InstitutionHeader user={user} />
            ) : (
              <CompanyHeader user={user} />
            )}
          </>
        )}
      </div>
      <div className="flex flex-col px-2 pt-2 pb-4 h-full space-y-4">
        <ViewEducation attestations={attestations} />
        <ViewExperience attestations={attestations} />
        <ViewEndorsement attestations={attestations} />
      </div>
    </>
  );
};

export default Home;

interface HeaderProps {
  user: User;
}

const TalentHeader: React.FC<HeaderProps> = (props) => {
  const { user } = props;

  if (!user) return "";

  return (
    <div className="w-full pt-5 flex items-end justify-around min-h-[150px]">
      <div>
        <img src={talentImg} alt="talent-image" width={120} style={{ objectFit: "contain" }}></img>
        <p className="text-white text-center">Talent</p>
      </div>
      <div>
        <div>
          <span className="text-white">
            {user.eoaAddress?.slice(0, 7)}...{user.eoaAddress?.slice(-5) || ""}
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
      <div>
        <img src={schoolImg} alt="talent-image" width={120} style={{ objectFit: "contain" }}></img>
        <p className="text-white text-center">Institution</p>
      </div>
      <div>
        <div>
          <span className="text-white">
            {user.eoaAddress?.slice(0, 7)}...{user.eoaAddress?.slice(-5) || ""}
          </span>
        </div>
        <p className="text-4xl pb-2 text-white">
          <span className="text-yellow">HI,</span>
          <br />
          {/* {user ? user.name?.toUpperCase() : "guest"} */}
          Sunway Uni
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
      <div>
        <img
          src={microscopeImg}
          alt="talent-image"
          width={120}
          style={{ objectFit: "contain" }}
        ></img>
        <p className="text-white text-center">Company</p>
      </div>
      <div>
        <div>
          <span className="text-white">
            {user.eoaAddress?.slice(0, 7)}...{user.eoaAddress?.slice(-5) || ""}
          </span>
        </div>
        <p className="text-4xl pb-2 text-white">
          <span className="text-yellow">HI,</span>
          <br />
          {/* {user ? user.name?.toUpperCase() : "guest"} */}
          Sunway Inc.
        </p>
      </div>
    </div>
  );
};
