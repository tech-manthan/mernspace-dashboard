import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "../../http/api";
import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";
import type { UpdateCatgoryData } from "../../types/category.type";

const updateCategoryFn = async ({
  id,
  categoryData,
}: {
  id: string;
  categoryData: UpdateCatgoryData;
}) => {
  const { data } = await updateCategory(id, categoryData);
  return data;
};

export const useUpdateCategory = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: updateCategoryFn,
    onSuccess: async () => {
      toast.success({
        content: "Category Updated Successfully",
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
