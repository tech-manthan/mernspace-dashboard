import { useQuery } from "@tanstack/react-query";
import { getTenant } from "../../http/api";
import type { Tenant } from "../../types/tenant.type";

const getTenantData = async (id: number) => {
  const { data } = await getTenant(id);
  return data;
};

export const useGetTenant = (id?: number, enabled: boolean = true) => {
  return useQuery<Tenant>({
    queryKey: ["getTenant", id],
    queryFn: getTenantData.bind(this, id!),
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 5,
  });
};
