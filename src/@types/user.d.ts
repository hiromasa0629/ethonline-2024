import { UserType } from "@prisma/client";
import { IProvider, UserInfo } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";

export interface IUser extends UserInfo {
  userType: UserType;
  address?: `0x${string}`;
}

export type Web3AuthContextType = {
  user?: Partial<IUser>;
  isLoggedIn: boolean;
  web3Auth: Web3Auth;
  web3AuthProvider: IProvider | null;
  isLoading: boolean;
  saveUser: (user: Partial<IUser> | undefined) => void;
  saveWeb3AuthProvider: (provider: IProvider | null) => void;
  handleSetIsLoggedIn: (loggedIn: boolean) => void;
  handleSetIsLoading: (isLoading: boolean) => void;
  postLoginFlow: () => Promise<void>;
};

export type ReqUserBody = {
  email: string;
  name: string;
  address: string;
  userType: UserType;
};
