import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTopping } from "../../http/api";
import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";
import type { UpdateToppingData } from "../../types/topping.type";
import { makeToppingFormData } from "../../utils/topping-helper";

const updateToppingFn = async ({
  id,
  toppingData,
}: {
  id: string;
  toppingData: UpdateToppingData;
}) => {
  const toppingFormData = makeToppingFormData(toppingData);

  const { data } = await updateTopping(id, toppingFormData);
  return data;
};

export const useUpdateTopping = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateTopping"],
    mutationFn: updateToppingFn,
    onSuccess: async () => {
      toast.success({
        content: "Topping Updated Successfully",
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
