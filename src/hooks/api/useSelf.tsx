import { useQuery } from "@tanstack/react-query";
import type { User } from "../../types/user.type";
import { self } from "../../http/api";
import { AxiosError } from "axios";

const selfData = async () => {
  const { data } = await self();
  return data;
};

interface UseSelfTypes {
  enabled?: boolean;
}

export const useSelf = (
  { enabled }: UseSelfTypes = {
    enabled: true,
  }
) => {
  return useQuery<User>({
    queryKey: ["self"],
    queryFn: selfData,
    enabled: enabled,
    retry: (failureCount: number, err) => {
      if (err instanceof AxiosError && err.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
