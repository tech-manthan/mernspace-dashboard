import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTenant } from "../../http/api";
import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";
import type { UpdateTenantData } from "../../types/tenant.type";

const updateTenantFn = async ({
  id,
  tenantData,
}: {
  id: number;
  tenantData: UpdateTenantData;
}) => {
  const { data } = await updateTenant(id, tenantData);
  return data;
};

export const useUpdateTenant = () => {
  const toast = useToast();
  // const { refetch } = useGetUsers(false);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateTenant"],
    mutationFn: updateTenantFn,
    onSuccess: async () => {
      toast.success({
        content: "Tenant Updated Successfully",
      });
      // await refetch();
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
