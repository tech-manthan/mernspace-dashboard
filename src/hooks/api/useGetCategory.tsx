import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../http/api";
import type { Category } from "../../types/category.type";

const getCategoryData = async (id: string) => {
  const { data } = await getCategory(id);
  return data;
};

export const useGetCategory = (id?: string, enabled: boolean = true) => {
  return useQuery<Category>({
    queryKey: ["getCategory", id],
    queryFn: getCategoryData.bind(this, id!),
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 5,
  });
};
