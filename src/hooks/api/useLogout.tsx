import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth.store";
import type { ResponseError } from "../../types/error.type";
import { logout } from "../../http/api";
import { useToast } from "../useToast";

const logoutUser = async () => {
  const { data } = await logout();
  return data;
};

export const useLogout = (redirect: boolean = false) => {
  const { removeUser } = useAuthStore();
  const toast = useToast();
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutUser,
    onSuccess: async () => {
      removeUser();
      toast.success({
        content: "Logged out successfully",
        onClose: () => {
          if (redirect) {
            window.location.href = import.meta.env.VITE_CLIENT_UI_URL;
          }
        },
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
