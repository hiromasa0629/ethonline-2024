import { useEffect, useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { User } from "firebase/auth";
import { useConversations } from "@xmtp/react-sdk";
import { useChat } from "./ChatContext";
import { BROADCASTER } from "./utils";

const ChatList = () => {
  const { findTalents } = useFirestore();
  const [allTalents, setAllTalents] = useState<User[]>([]);
  const { conversations } = useConversations();
  const { setSelectedChat } = useChat();
  BROADCASTER;

  useEffect(() => {
    const getUsers = async () => {
      const talents = await findTalents();
      // setAllTalents(talents.filter((v) => v.name !== user?.name));
      setAllTalents(talents as any);
    };
    getUsers();
  }, []);
  return (
    <ul className="p-4 bg-gray-50 rounded-lg shadow-inner">
      {conversations.map((convo: any, index: any) => {
        let name: any = allTalents.filter((talent: any) => {
          return talent.eoaAddress === convo.peerAddress;
        });
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
            <button className="bg-blue-500 text-white px-4 py-1 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition">
              Chat
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ChatList;
