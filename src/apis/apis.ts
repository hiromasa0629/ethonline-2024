import { User, UserType } from "@prisma/client";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api/",
});

const getTalentByEmail = async (email: string): Promise<User> => {
  return (await apiClient.get(`/talents/${email}`)).data;
};

const getTalents = async (): Promise<User[]> => {
  return (await apiClient.get("/talents")).data;
};

const getInstitutions = async (): Promise<User[]> => {
  return (await apiClient.get("/institutions")).data;
};

const getCompanies = async (): Promise<User[]> => {
  return (await apiClient.get("/companies")).data;
};

const createUser = async (
  email: string | undefined,
  name: string | undefined,
  address: string | undefined,
  userType: UserType
) => {
  const u = await getTalentByEmail(email ?? "");
  if (u) return;
  await apiClient.post("/user", { email, name, address, userType });
};

export const APIs = { getTalentByEmail, getTalents, getCompanies, getInstitutions, createUser };
