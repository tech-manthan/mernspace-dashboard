import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTenant } from "../../http/api";
import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";
import type { CreateTenantData } from "../../types/tenant.type";

const createTenantFn = async (tenantData: CreateTenantData) => {
  const { data } = await createTenant(tenantData);
  return data;
};

export const useCreateTenant = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTenant"],
    mutationFn: createTenantFn,
    onSuccess: async () => {
      toast.success({
        content: "Restaurant Created Successfully",
      });
      await queryClient.invalidateQueries({
        queryKey: ["getTenants"],
      });
    },
    onError: async (error) => {
      toast.error(
        (error as ResponseError).response.data.errors
          ? (error as ResponseError).response.data.errors[0].msg
          : error.message
      );
    },
  });
};
