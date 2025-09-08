import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { GetUsers, UsersQueryParams } from "../../types/user.type";
import { getUsers } from "../../http/api";
import { PER_PAGE } from "../../constants";

const getUsersData = async (queryString: string) => {
  const { data } = await getUsers(queryString);
  return data;
};

export const useGetUsers = (
  enabled: boolean = true,
  queryParams: UsersQueryParams = {
    currentPage: 1,
    perPage: PER_PAGE,
    q: "",
    isBanned: undefined,
    role: undefined,
  }
) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams).filter((item) => !!item[1])
  );
  const queryString = new URLSearchParams(
    filteredParams as unknown as Record<string, string>
  ).toString();
  return useQuery<GetUsers>({
    queryKey: ["getUsers", queryParams],
    queryFn: getUsersData.bind(this, queryString),
    enabled,
    placeholderData: keepPreviousData,
  });
};
