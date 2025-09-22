import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../../http/api";
import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";
import type { CreateCatgoryData } from "../../types/category.type";

const createCategoryFn = async (categoryData: CreateCatgoryData) => {
  const { data } = await createCategory(categoryData);
  return data;
};

export const useCreateCategory = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createCategory"],
    mutationFn: createCategoryFn,
    onSuccess: async () => {
      toast.success({
        content: "Category Created Successfully",
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
