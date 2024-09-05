import talentImg from "../../public/assets/talent.png";
import { useWeb3Auth } from "../hooks/useWeb3Auth";

const Home = () => {
  const { user } = useWeb3Auth();
  return (
    <div className="w-full h-fit flex flex-col space-y-6 bg-purple rounded-b-2xl">
      <div className="w-full pt-5 flex items-end justify-around">
        <img src={talentImg} alt="talent-image" width={120} style={{ objectFit: "contain" }}></img>
        <p className="text-4xl pb-2 text-white">
          <span className="text-yellow">HI,</span>
          <br />
          {user ? user.name?.toUpperCase() : "guest"}
        </p>
      </div>
    </div>
  );
};

export default Home;
