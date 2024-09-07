import { useEffect, useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { User } from "firebase/auth";
import { useConversations } from "@xmtp/react-sdk";

const ChatList = () => {
  const { findTalents } = useFirestore();
  const [allTalents, setAllTalents] = useState<User[]>([]);
  const { conversations, error, isLoading } = useConversations();

  useEffect(() => {
    const getUsers = async () => {
      const talents = await findTalents();
      // setAllTalents(talents.filter((v) => v.name !== user?.name));
      setAllTalents(talents as any);
    };
    getUsers();
  }, []);
  if (error) {
    return "An error occurred while loading conversations";
  }

  if (isLoading) {
    return "Loading conversations...";
  }
  console.log(conversations);
  return (
    <ul className="p-4">
      {conversations.map((convo: any, index: any) => {
        let name: any = allTalents.filter((talent: any) => {
          return talent.eoaAddress === convo.peerAddress;
        });
        name = name.length > 0 ? name[0].name : undefined;
        return (
          <li
            key={index}
            // onClick={() => setSelectedChat(talent.eoaAddress)}
            className="cursor-pointer p-4 mb-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <p>
              {name ? `${name} | ` : "Elon Musk | "}
              {convo.peerAddress}
            </p>
          </li>
        );
      })}
    </ul>
  );
};

export default ChatList;
