import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useFirestore } from "../hooks/useFirestore";
import { ChatContextType, useChat } from "../modules/chat/ChatContext";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const { findTalents } = useFirestore();
  const [allTalents, setAllTalents] = useState<User[]>([]);
  const navigate = useNavigate();
  const { selectedChat, setSelectedChat } = useChat();

  useEffect(() => {
    const getUsers = async () => {
      const talents = await findTalents();
      // setAllTalents(talents.filter((v) => v.name !== user?.name));
      setAllTalents(talents as any);
    };
    getUsers();
  }, []);

  return (
    <ul className="p-4">
      {allTalents.map((talent: any, index: any) => {
        return (
          <li
            key={index}
            className="cursor-pointer p-4 mb-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            onClick={() => {
              setSelectedChat(talent.eoaAddress);
              navigate("/chat");
            }}
          >
            {talent.name} | {talent.eoaAddress}
          </li>
        );
      })}
    </ul>
  );
};

export default Search;
