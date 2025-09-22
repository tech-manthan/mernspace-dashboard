import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCategories } from "../../http/api";
import { PER_PAGE } from "../../constants";
import type {
  CategoriesQueryParams,
  GetCategories,
} from "../../types/category.type";

const getCategoriesData = async (queryString: string) => {
  const { data } = await getCategories(queryString);
  return data;
};

export const useGetCategories = (
  enabled: boolean = true,
  queryParams: CategoriesQueryParams = {
    currentPage: 1,
    perPage: PER_PAGE,
    q: "",
  }
) => {
  const filteredParams = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(queryParams).filter(([_, value]) => {
      return (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value !== "undefined"
      );
    })
  );
  const queryString = new URLSearchParams(filteredParams).toString();
  return useQuery<GetCategories>({
    queryKey: ["getCategories", queryParams],
    queryFn: getCategoriesData.bind(this, queryString),
    enabled,
    placeholderData: keepPreviousData,
  });
};
