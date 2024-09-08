import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useFirestore } from "../hooks/useFirestore";
import { useChat } from "../modules/chat/ChatContext";
import { useNavigate } from "react-router-dom";
import { BROADCASTER } from "../modules/chat/utils";
import { useWeb3Auth } from "../hooks/useWeb3Auth";

const Search = () => {
  const { findTalents } = useFirestore();
  const [allTalents, setAllTalents] = useState<User[]>([]);
  const [viewType, setViewType] = useState<"talent" | "notTalent">("talent");
  const navigate = useNavigate();
  const { user } = useWeb3Auth();
  const { setSelectedChat } = useChat();

  useEffect(() => {
    const getUsers = async () => {
      const talents = await findTalents();
      setAllTalents(talents.filter((v) => v.eoaAddress !== user?.eoaAddress) as any);
    };
    getUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-6">
        {viewType === "talent" ? "Search for Companies" : "Search for Talents"}
      </h1>

      {/* Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setViewType("talent")}
          className={`px-6 py-2 ${
            viewType === "talent" ? "bg-blue-600" : "bg-blue-500"
          } text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition`}
        >
          Talents
        </button>
        <button
          onClick={() => setViewType("notTalent")}
          className={`px-6 py-2 ${
            viewType === "notTalent" ? "bg-green-600" : "bg-green-500"
          } text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition`}
        >
          Company/Institution
        </button>
      </div>

      {/* List */}
      {viewType === "talent" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">List of Talents</h2>
          <ul className="p-4 bg-gray-50 rounded-lg shadow-inner">
            {allTalents.map((talent: any, index: any) => (
              <li
                key={index}
                className="cursor-pointer p-4 mb-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex justify-between items-center"
                onClick={() => {
                  setSelectedChat({ name: talent.name, eoaAddress: talent.eoaAddress });
                  navigate("/chat");
                }}
              >
                <div className="flex flex-col">
                  {/* Name */}
                  <span className="font-semibold text-lg text-gray-800">{talent.name}</span>

                  {/* eoaAddress */}
                  <span className="text-sm text-gray-500">
                    {talent.eoaAddress.slice(0, 7)}...{talent.eoaAddress.slice(-5) || ""}
                  </span>
                </div>
                <button className="bg-blue-500 text-white px-4 py-1 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition">
                  Chat
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {viewType === "notTalent" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">List of Companies</h2>
          <ul className="p-4 bg-gray-50 rounded-lg shadow-inner">
            {Object.keys(BROADCASTER).map((key: any) => (
              <li
                key={key}
                className="cursor-pointer p-4 mb-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex justify-between items-center"
                onClick={() => {
                  setSelectedChat({ name: key, eoaAddress: BROADCASTER[key] });
                  navigate("/chat");
                }}
              >
                <div className="flex flex-col">
                  {/* Name */}
                  <span className="font-semibold text-lg text-gray-800">{key}</span>

                  {/* eoaAddress */}
                  <span className="text-sm text-gray-500">
                    {BROADCASTER[key].slice(0, 7)}...{BROADCASTER[key].slice(-5) || ""}
                  </span>
                </div>
                <button className="bg-blue-500 text-white px-4 py-1 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition">
                  Chat
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
{
  /* {viewType === "student" && <BroadcasterDropdown {...{ selectedBroadcaster, handleSelectChange, isOnNetwork }} />} */
}
export default Search;
