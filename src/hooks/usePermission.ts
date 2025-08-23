import type { User, UserRole } from "../types/user.type";

export const usePermission = () => {
  const allowedRoles: UserRole[] = ["admin", "manager"];

  const _hasPermission = (user: User | null) => {
    if (user) {
      return allowedRoles.includes(user.role);
    }
    return false;
  };

  return {
    isAllowed: _hasPermission,
  };
};
