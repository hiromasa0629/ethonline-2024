import { useContext } from "react";
import { Web3AuthContext } from "../contexts/Web3AuthProvider";
import { Web3AuthContextType } from "../@types/user";
import RPC from "../utils/ethersRPC";

export const useWeb3Auth = () => {
  const {
    user,
    saveUser,
    web3Auth,
    web3AuthProvider,
    saveWeb3AuthProvider,
    handleSetIsLoggedIn,
    isLoggedIn,
  } = useContext(Web3AuthContext) as Web3AuthContextType;

  const handleLogIn = async () => {
    const provider = await web3Auth.connect();
    saveWeb3AuthProvider(provider);
    if (web3Auth.connected && web3AuthProvider) {
      const user = await web3Auth.getUserInfo();
      const address = await RPC.getAccounts(web3AuthProvider);
      saveUser({ ...user, address });
      handleSetIsLoggedIn;
    }
  };

  const handleLogOut = async () => {
    await web3Auth.logout();
    saveUser(undefined);
    saveWeb3AuthProvider(null);
  };

  return {
    handleLogIn,
    handleLogOut,
    user,
    web3AuthProvider,
    isLoggedIn,
  };
};
