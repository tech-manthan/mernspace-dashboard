import { useQuery } from "@tanstack/react-query";
import type { User } from "../../types/user.type";
import { self } from "../../http/api";

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
  });
};
