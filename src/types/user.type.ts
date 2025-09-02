import type { Tenant } from "./tenant.type";

export type UserRole = "customer" | "admin" | "manager";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  tenant: Tenant | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetUsers {
  currentPage: number;
  perPage: number;
  total: number;
  data: User[];
}
