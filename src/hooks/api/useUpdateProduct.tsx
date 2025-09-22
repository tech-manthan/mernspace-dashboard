import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../../http/api";
import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";
import type { UpdateProductData } from "../../types/product.type";
import { makeProductFormData } from "../../utils/product-helper";

const updateProductFn = async ({
  id,
  productData,
}: {
  id: string;
  productData: UpdateProductData;
}) => {
  const productFormData = makeProductFormData(productData);

  const { data } = await updateProduct(id, productFormData);
  return data;
};

export const useUpdateProduct = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: updateProductFn,
    onSuccess: async () => {
      toast.success({
        content: "Product Updated Successfully",
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
