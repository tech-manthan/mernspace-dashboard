import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../../http/api";
import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";
import type { CreateUserData } from "../../types/user.type";
// import { useGetUsers } from "./useGetUsers";

const createUserFn = async (userData: CreateUserData) => {
  const { data } = await createUser(userData);
  return data;
};

export const useCreateUser = () => {
  const toast = useToast();
  // const { refetch } = useGetUsers(false);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createUser"],
    mutationFn: createUserFn,
    onSuccess: async () => {
      toast.success({
        content: "User Created Successfully",
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
