import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getCategories } from "../../http/api";
import type {
  CategoriesQueryParams,
  GetCategories,
} from "../../types/category.type";

const getCategoriesData = async (queryParams: CategoriesQueryParams) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams).filter((item) => !!item[1])
  );

  const queryString = new URLSearchParams(
    filteredParams as unknown as Record<string, string>
  ).toString();

  const { data } = await getCategories(queryString);
  return data;
};

export const useGetInfiniteCategories = (
  enabled: boolean = true,
  search: string
) => {
  return useInfiniteQuery<GetCategories>({
    queryKey: ["infiniteCategories", search],
    queryFn: ({ pageParam = 1 }) =>
      getCategoriesData({
        perPage: 10,
        q: search,
        currentPage: pageParam as number,
      }),
    enabled,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.perPage);
      if (lastPage.currentPage < totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });
};
