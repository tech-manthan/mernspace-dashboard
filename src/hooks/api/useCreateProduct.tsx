import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../../http/api";
import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";
import type { CreateProductData } from "../../types/product.type";
import { makeProductFormData } from "../../utils/product-helper";

const createProductFn = async (productData: CreateProductData) => {
  const productFormData = makeProductFormData(productData);
  const { data } = await createProduct(productFormData);
  return data;
};

export const useCreateProduct = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createProduct"],
    mutationFn: createProductFn,
    onSuccess: async () => {
      toast.success({
        content: "Product Created Successfully",
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
