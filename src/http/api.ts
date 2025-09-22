import type { LoginData } from "../types/auth.type";
import type {
  CreateCatgoryData,
  UpdateCatgoryData,
} from "../types/category.type";
import type { CreateTenantData, UpdateTenantData } from "../types/tenant.type";
import type { CreateUserData, UpdateUserData } from "../types/user.type";
import { api, AUTH_SERVICE, CATALOG_SERVICE } from "./client";

// Auth Service
export const login = (credentials: LoginData) =>
  api.post(`/${AUTH_SERVICE}/auth/login`, credentials);
export const self = () => api.get(`/${AUTH_SERVICE}/auth/self`);
export const logout = () => api.post(`/${AUTH_SERVICE}/auth/logout`);
export const getUsers = (queryString: string) =>
  api.get(`/${AUTH_SERVICE}/users?${queryString}`);
export const createUser = (data: CreateUserData) =>
  api.post(`/${AUTH_SERVICE}/users`, data);
export const updateUser = (id: number, data: UpdateUserData) =>
  api.patch(`/${AUTH_SERVICE}/users/${id}`, data);
export const deleteUser = (id: number) =>
  api.delete(`/${AUTH_SERVICE}/users/${id}`);
export const getTenants = (queryString: string) =>
  api.get(`/${AUTH_SERVICE}/tenants?${queryString}`);
export const getTenant = (id: number) =>
  api.get(`/${AUTH_SERVICE}/tenants/${id}`);
export const createTenant = (data: CreateTenantData) =>
  api.post(`/${AUTH_SERVICE}/tenants`, data);
export const updateTenant = (id: number, data: UpdateTenantData) =>
  api.patch(`/${AUTH_SERVICE}/tenants/${id}`, data);
export const deleteTenant = (id: number) =>
  api.delete(`/${AUTH_SERVICE}/tenants/${id}`);

// CATALOG SERVICE
export const getCategories = (queryString: string) =>
  api.get(`/${CATALOG_SERVICE}/categories?${queryString}`);
export const getCategory = (id: string) =>
  api.get(`/${CATALOG_SERVICE}/categories/${id}`);
export const createCategory = (data: CreateCatgoryData) =>
  api.post(`/${CATALOG_SERVICE}/categories`, data);
export const updateCategory = (id: string, data: UpdateCatgoryData) =>
  api.patch(`/${CATALOG_SERVICE}/categories/${id}`, data);
export const deleteCatgory = (id: string) =>
  api.delete(`/${CATALOG_SERVICE}/categories/${id}`);

export const getProducts = (queryString: string) =>
  api.get(`/${CATALOG_SERVICE}/products?${queryString}`);
export const getProduct = (id: string) =>
  api.get(`/${CATALOG_SERVICE}/products/${id}`);
export const deleteProduct = (id: string) =>
  api.delete(`/${CATALOG_SERVICE}/products/${id}`);
export const createProduct = (data: FormData) =>
  api.post(`/${CATALOG_SERVICE}/products`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateProduct = (id: string, data: FormData) =>
  api.patch(`/${CATALOG_SERVICE}/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getToppings = (queryString: string) =>
  api.get(`/${CATALOG_SERVICE}/toppings?${queryString}`);
export const getTopping = (id: string) =>
  api.get(`/${CATALOG_SERVICE}/toppings/${id}`);
export const deleteTopping = (id: string) =>
  api.delete(`/${CATALOG_SERVICE}/toppings/${id}`);
export const createTopping = (data: FormData) =>
  api.post(`/${CATALOG_SERVICE}/toppings`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateTopping = (id: string, data: FormData) =>
  api.patch(`/${CATALOG_SERVICE}/toppings/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
