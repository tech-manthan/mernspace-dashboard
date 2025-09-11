import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";
import { deleteTenant } from "../../http/api";

const deleteTenantFn = async (id: number) => {
  const { data } = await deleteTenant(id);
  return data;
};

export const useDeleteTenant = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteTenant"],
    mutationFn: deleteTenantFn,
    onSuccess: async () => {
      toast.success({
        content: "Tenant Deleted Successfully",
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
