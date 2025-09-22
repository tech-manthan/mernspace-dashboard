import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";
import { deleteCatgory } from "../../http/api";

const deleteCategoryFn = async (id: string) => {
  const { data } = await deleteCatgory(id);
  return data;
};

export const useDeleteCategory = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: deleteCategoryFn,
    onSuccess: async () => {
      toast.success({
        content: "Category Deleted Successfully",
      });
      await queryClient.invalidateQueries({
        queryKey: ["getCategories"],
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
