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
  }
) => {
  const queryString = new URLSearchParams(
    queryParams as unknown as Record<string, string>
  ).toString();
  return useQuery<GetUsers>({
    queryKey: ["getUsers", queryParams],
    queryFn: getUsersData.bind(this, queryString),
    enabled,
    placeholderData: keepPreviousData,
  });
};
