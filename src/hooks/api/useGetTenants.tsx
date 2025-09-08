import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTenants } from "../../http/api";
import type { GetTenants, TenantsQueryParams } from "../../types/tenant.type";
import { PER_PAGE } from "../../constants";

const getTenantsData = async (queryString: string) => {
  const { data } = await getTenants(queryString);
  return data;
};

export const useGetTenants = (
  enabled: boolean = true,
  queryParams: TenantsQueryParams = {
    currentPage: 1,
    perPage: PER_PAGE,
  }
) => {
  const queryString = new URLSearchParams(
    queryParams as unknown as Record<string, string>
  ).toString();
  return useQuery<GetTenants>({
    queryKey: ["getTenants", queryParams],
    queryFn: getTenantsData.bind(this, queryString),
    enabled,
    placeholderData: keepPreviousData,
  });
};
