import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../http/api";
import type { GetTenants } from "../../types/tenant.type";

const getTenantsData = async () => {
  const { data } = await getTenants();
  return data;
};

export const useGetTenants = (enabled: boolean = true) => {
  return useQuery<GetTenants>({
    queryKey: ["getTenants"],
    queryFn: getTenantsData,
    enabled,
  });
};
