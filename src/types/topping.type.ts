import type { ImageField } from "./common.type";

export interface Topping {
  _id: string;
  name: string;
  price: number;
  image: string;
  tenantId: string;
  categoryId: string;
  isPublish: boolean;
  createdAt: string;
}

export interface CreateToppingData {
  name: string;
  price: number;
  image: ImageField;
  tenantId: string;
  categoryId: string;
  isPublish: boolean;
}

export interface UpdateToppingData {
  name?: string | undefined;
  price?: number | undefined;
  image?: ImageField | undefined;
  tenantId?: string;
  categoryId?: string;
  isPublish?: boolean;
}

export interface ToppingsQueryParams {
  perPage: number;
  currentPage: number;
  q: string;
  tenantId: string;
  categoryId: string;
  isPublish: boolean | undefined;
}

export interface GetToppings {
  currentPage: number;
  perPage: number;
  total: number;
  data: Topping[];
}
