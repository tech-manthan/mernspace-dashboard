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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryParams).filter(([_, value]) => {
      return (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value !== "undefined"
      );
    })
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
