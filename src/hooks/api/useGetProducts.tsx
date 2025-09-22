import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts } from "../../http/api";
import { PER_PAGE } from "../../constants";
import type {
  GetProducts,
  ProductsQueryParams,
} from "../../types/product.type";

const getProductsData = async (queryString: string) => {
  const { data } = await getProducts(queryString);
  return data;
};

export const useGetProducts = (
  enabled: boolean = true,
  queryParams: ProductsQueryParams = {
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
  return useQuery<GetProducts>({
    queryKey: ["getProducts", queryParams],
    queryFn: getProductsData.bind(this, queryString),
    enabled,
    placeholderData: keepPreviousData,
  });
};
