import { useContext } from "react";
import { Web3AuthContext } from "../contexts/Web3AuthProvider";
import { Web3AuthContextType } from "../@types/user";

export const useWeb3Auth = () => {
  const {
    user,
    saveUser,
    web3Auth,
    web3AuthProvider,
    saveWeb3AuthProvider,
    handleSetIsLoggedIn,
    isLoggedIn,
    postLoginFlow,
    isLoading,
    web3AuthSigner,
    smartWallet,
  } = useContext(Web3AuthContext) as Web3AuthContextType;

  console.log(user?.eoaAddress);

  const handleLogIn = async () => {
    const provider = await web3Auth.connect();
    saveWeb3AuthProvider(provider);
    await postLoginFlow(provider);
  };

  const handleLogOut = async () => {
    await web3Auth.logout();
    saveUser(undefined);
    saveWeb3AuthProvider(null);
    handleSetIsLoggedIn(false);
  };

  return {
    handleLogIn,
    handleLogOut,
    user,
    web3AuthProvider,
    isLoggedIn,
    isLoading,
    web3AuthSigner,
    smartWallet,
  };
};
