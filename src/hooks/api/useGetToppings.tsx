import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getToppings } from "../../http/api";
import { PER_PAGE } from "../../constants";
import type {
  GetToppings,
  ToppingsQueryParams,
} from "../../types/topping.type";

const getToppingsData = async (queryString: string) => {
  const { data } = await getToppings(queryString);
  return data;
};

export const useGetToppings = (
  enabled: boolean = true,
  queryParams: ToppingsQueryParams = {
    currentPage: 1,
    perPage: PER_PAGE,
    q: "",
    categoryId: "",
    isPublish: undefined,
    tenantId: "",
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
  return useQuery<GetToppings>({
    queryKey: ["getToppings", queryParams],
    queryFn: getToppingsData.bind(this, queryString),
    enabled,
    placeholderData: keepPreviousData,
  });
};
