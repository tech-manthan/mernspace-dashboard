import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTopping } from "../../http/api";
import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";
import type { CreateToppingData } from "../../types/topping.type";
import { makeToppingFormData } from "../../utils/topping-helper";

const createToppingFn = async (toppingData: CreateToppingData) => {
  const toppingFormData = makeToppingFormData(toppingData);
  const { data } = await createTopping(toppingFormData);
  return data;
};

export const useCreateTopping = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTopping"],
    mutationFn: createToppingFn,
    onSuccess: async () => {
      toast.success({
        content: "Topping Created Successfully",
      });
      await queryClient.invalidateQueries({
        queryKey: ["getToppings"],
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
