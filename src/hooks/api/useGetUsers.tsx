import { useQuery } from "@tanstack/react-query";
import type { GetUsers } from "../../types/user.type";
import { getUsers } from "../../http/api";

const getUsersData = async () => {
  const { data } = await getUsers();
  return data;
};

export const useGetUsers = () => {
  return useQuery<GetUsers>({
    queryKey: ["getUsers"],
    queryFn: getUsersData,
  });
};
