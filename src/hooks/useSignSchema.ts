import { useContext } from "react";
import { SignProtocolContext } from "../contexts/SignProtocolProvider";
import { SignProtocolContextType } from "../@types/sign";

export const useSignSchema = () => {
  const { signClient } = useContext(
    SignProtocolContext
  ) as SignProtocolContextType;

  const createSchema = async () => {
    if (!signClient) return;
    console.log(signClient);
    const res = await signClient.createSchema({
      name: "Schema Name",
      data: [{ name: "name", type: "string" }],
    });
    return res;
  };

  return {
    createSchema,
  };
};
