import { createContext, useState, useContext, Dispatch, SetStateAction } from "react";

export type ChatContextType = {
  selectedChat: any;
  setSelectedChat: Dispatch<SetStateAction<null>>;
};

// Create the ChatContext
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component
export const ChatProvider = ({ children }: { children: any }) => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <ChatContext.Provider value={{ selectedChat, setSelectedChat }}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook to use the ChatContext
export const useChat = () => {
  return useContext(ChatContext);
};
