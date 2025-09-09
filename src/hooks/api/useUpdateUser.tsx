import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "../../http/api";
import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";
import type { UpdateUserData } from "../../types/user.type";

const updateUserFn = async ({
  id,
  userData,
}: {
  id: number;
  userData: UpdateUserData;
}) => {
  const { data } = await updateUser(id, userData);
  return data;
};

export const useUpdateUser = () => {
  const toast = useToast();
  // const { refetch } = useGetUsers(false);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateUser"],
    mutationFn: updateUserFn,
    onSuccess: async () => {
      toast.success({
        content: "User Updated Successfully",
      });
      // await refetch();
      await queryClient.invalidateQueries({
        queryKey: ["getUsers"],
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
