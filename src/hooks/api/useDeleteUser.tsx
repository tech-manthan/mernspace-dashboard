import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";
import { deleteUser } from "../../http/api";

const deleteUserFn = async (id: number) => {
  const { data } = await deleteUser(id);
  return data;
};

export const useDeleteUser = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: deleteUserFn,
    onSuccess: async () => {
      toast.success({
        content: "User Deleted Successfully",
      });
      await queryClient.invalidateQueries({
        queryKey: ["getUsers"],
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
