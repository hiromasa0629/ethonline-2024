import { useWeb3Auth } from "../hooks/useWeb3Auth";

const Home = () => {
  const { user } = useWeb3Auth();

  return (
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
  );
};

export default Home;
