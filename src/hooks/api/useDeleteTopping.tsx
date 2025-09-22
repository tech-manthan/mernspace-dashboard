import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";
import { deleteTopping } from "../../http/api";

const deleteToppingFn = async (id: string) => {
  const { data } = await deleteTopping(id);
  return data;
};

export const useDeleteTopping = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteTopping"],
    mutationFn: deleteToppingFn,
    onSuccess: async () => {
      toast.success({
        content: "Topping Deleted Successfully",
      });
      await queryClient.invalidateQueries({
        queryKey: ["getToppings"],
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
