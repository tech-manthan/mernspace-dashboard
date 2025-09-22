import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";
import { deleteProduct } from "../../http/api";

const deleteProductFn = async (id: string) => {
  const { data } = await deleteProduct(id);
  return data;
};

export const useDeleteProduct = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: deleteProductFn,
    onSuccess: async () => {
      toast.success({
        content: "Product Deleted Successfully",
      });
      await queryClient.invalidateQueries({
        queryKey: ["getProducts"],
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
