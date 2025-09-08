import type { LoginData } from "../types/auth.type";
import type { CreateTenantData } from "../types/tenant.type";
import type { CreateUserData } from "../types/user.type";
import { api } from "./client";

// Auth Service
export const login = (credentials: LoginData) =>
  api.post("/auth/login", credentials);
export const self = () => api.get("/auth/self");
export const logout = () => api.post("/auth/logout");
export const getUsers = (queryString: string) =>
  api.get(`/users?${queryString}`);
export const createUser = (data: CreateUserData) => api.post("/users", data);
export const getTenants = (queryString: string) =>
  api.get(`/tenants?${queryString}`);
export const createTenant = (data: CreateTenantData) =>
  api.post("/tenants", data);
