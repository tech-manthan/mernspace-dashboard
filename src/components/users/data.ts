import type { UserRole } from "../../types/user.type";

export const selectRolesOptions: Array<{ value: UserRole; label: string }> = [
  {
    value: "customer",
    label: "Customer",
  },
  {
    value: "manager",
    label: "Manager",
  },
  {
    value: "admin",
    label: "Admin",
  },
];

export const selectStatusOptions: Array<{
  value: boolean;
  label: string;
}> = [
  {
    value: true,
    label: "Banned",
  },
  {
    value: false,
    label: "Active",
  },
];
