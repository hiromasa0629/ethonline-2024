import { useEffect, useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { User } from "firebase/auth";
import { useConversations } from "@xmtp/react-sdk";
import { useChat } from "./ChatContext";
import { BROADCASTER } from "./utils";
import { useWeb3Auth } from "../../hooks/useWeb3Auth";

const ChatList = () => {
  const { findTalents, findCompanies, findInstitutions } = useFirestore();
  const [allTalents, setAllTalents] = useState<User[]>([]);
  const [allCompanies, setAllCompanies] = useState<User[]>([]);
  const [allInstitutions, setAllInstitutions] = useState<User[]>([]);
  const { conversations } = useConversations();
  const { setSelectedChat } = useChat();
  const { user } = useWeb3Auth();

  useEffect(() => {
    const getEveryone = async () => {
      const talents = await findTalents();
      const companies = await findCompanies();
      const institutions = await findInstitutions();
      setAllTalents(talents.filter((v) => v.eoaAddress !== user?.eoaAddress) as any);
      setAllCompanies(companies.filter((v) => v.eoaAddress !== user?.eoaAddress) as any);
      setAllInstitutions(institutions.filter((v) => v.eoaAddress !== user?.eoaAddress) as any);
    };
    getEveryone();
  }, []);
  return (
    <div className="max-w-4xl w-[95%] mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Connections</h1>

      <ul className="p-4 bg-gray-50 rounded-lg shadow-inner">
        {conversations.map((convo: any, index: any) => {
          let name: any = [...allTalents, ...allCompanies, ...allInstitutions].filter(
            (talent: any) => {
              return talent.eoaAddress === convo.peerAddress;
            }
          );
          if (name.length === 0) {
            Object.keys(BROADCASTER).map((key: any) => {
              if (BROADCASTER[key] === convo.peerAddress) {
                name = [{ name: key }];
                return;
              }
            });
          }
          name = name.length > 0 ? name[0].name : "Elon Musk";
          return (
            <li
              key={index}
              className="cursor-pointer p-4 mb-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex justify-between items-center"
              onClick={() => {
                setSelectedChat({ name: name, eoaAddress: convo.peerAddress });
              }}
            >
              <div className="flex flex-col">
                {/* Name */}
                <span className="font-semibold text-lg text-gray-800">{name}</span>

                {/* eoaAddress */}
                <span className="text-sm text-gray-500">
                  {convo.peerAddress.slice(0, 7)}...{convo.peerAddress.slice(-5) || ""}
                </span>
              </div>
              <button className="bg-purple text-white px-4 py-1 rounded-lg shadow hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition">
                Chat
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatList;
