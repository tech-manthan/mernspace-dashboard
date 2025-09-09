import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getTenants } from "../../http/api";
import type { GetTenants, TenantsQueryParams } from "../../types/tenant.type";

const getTenantsData = async (queryParams: TenantsQueryParams) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams).filter((item) => !!item[1])
  );

  const queryString = new URLSearchParams(
    filteredParams as unknown as Record<string, string>
  ).toString();

  const { data } = await getTenants(queryString);
  return data;
};

export const useGetInfiniteTenants = (
  enabled: boolean = true,
  search: string
) => {
  return useInfiniteQuery<GetTenants>({
    queryKey: ["infiniteTenants", search],
    queryFn: ({ pageParam = 1 }) =>
      getTenantsData({
        perPage: 10,
        q: search,
        currentPage: pageParam as number,
      }),
    enabled,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.perPage);
      if (lastPage.currentPage < totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });
};
