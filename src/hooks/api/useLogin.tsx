import { useMutation } from "@tanstack/react-query";
import { login } from "../../http/api";
import type { LoginData } from "../../types/auth.type";
import { useSelf } from "./useSelf";
import { useLogout } from "./useLogout";
import { useAuthStore } from "../../store/auth.store";
import { usePermission } from "../usePermission";
import { useNavigate } from "react-router-dom";
import type { ResponseError } from "../../types/error.type";
import { useToast } from "../useToast";

const loginUser = async ({ email, password }: LoginData) => {
  const { data } = await login({
    email,
    password,
  });
  return data;
};

export const useLogin = () => {
  const { refetch } = useSelf({ enabled: false });
  const { mutate: mutateLogout } = useLogout(true);
  const { setUser } = useAuthStore();
  const toast = useToast();
  const { isAllowed } = usePermission();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      const result = await refetch();

      if (result.status === "error" || !result.data) {
        toast.error({
          content: "Login Failed, Try again",
        });
        return;
      }

      if (!isAllowed(result.data)) {
        toast.error({
          content: "Customer not allowed to access Mernspace Dashboard",
        });
        mutateLogout();
        return;
      }

      setUser(result.data);
      toast.success({
        content: "Login Successfull",
        onClose: () => {
          navigate("/", {
            replace: true,
          });
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
