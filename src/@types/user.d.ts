import { User, UserType } from "@prisma/client";
import { IProvider, UserInfo } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { ethers } from "ethers";
import { BiconomySmartAccountV2 } from "@biconomy/account";

export interface IUser extends UserInfo {
  userType: UserType;
  address?: `0x${string}`;
}

export type Web3AuthContextType = {
  user?: User;
  isLoggedIn: boolean;
  web3Auth: Web3Auth;
  web3AuthProvider: IProvider | null;
  isLoading: boolean;
  web3AuthSigner: ethers.providers.JsonRpcSigner | undefiend;
  smartWallet: BiconomySmartAccountV2 | undefined;
  saveUser: (user: User | undefined) => void;
  saveWeb3AuthProvider: (provider: IProvider | null) => void;
  handleSetIsLoggedIn: (loggedIn: boolean) => void;
  handleSetIsLoading: (isLoading: boolean) => void;
  postLoginFlow: (provider: IProvider | null) => Promise<void>;
};

export type ReqUserBody = {
  email: string;
  name: string;
  address: string;
  userType: UserType;
};
