import type { LoginData } from "../types/auth.type";
import type { CreateTenantData, UpdateTenantData } from "../types/tenant.type";
import type { CreateUserData, UpdateUserData } from "../types/user.type";
import { api } from "./client";

// Auth Service
export const login = (credentials: LoginData) =>
  api.post("/auth/login", credentials);
export const self = () => api.get("/auth/self");
export const logout = () => api.post("/auth/logout");
export const getUsers = (queryString: string) =>
  api.get(`/users?${queryString}`);
export const createUser = (data: CreateUserData) => api.post("/users", data);
export const updateUser = (id: number, data: UpdateUserData) =>
  api.patch(`/users/${id}`, data);
export const deleteUser = (id: number) => api.delete(`/users/${id}`);
export const getTenants = (queryString: string) =>
  api.get(`/tenants?${queryString}`);
export const getTenant = (id: number) => api.get(`/tenants/${id}`);
export const createTenant = (data: CreateTenantData) =>
  api.post("/tenants", data);
export const updateTenant = (id: number, data: UpdateTenantData) =>
  api.patch(`/tenants/${id}`, data);
export const deleteTenant = (id: number) => api.delete(`/tenants/${id}`);
