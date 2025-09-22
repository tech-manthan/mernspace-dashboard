import type { Category } from "./category.type";
import type { ImageField, PriceType } from "./common.type";

export interface ProductPriceConfigurationValue {
  priceType: PriceType;
  availableOptions: {
    [key: string]: number;
  };
}

export interface ProductPriceConfiguration {
  [key: string]: ProductPriceConfigurationValue;
}

export interface ProductAttribute {
  name: string;
  value: unknown;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  priceConfiguration: ProductPriceConfiguration;
  attributes: ProductAttribute[];
  tenantId: string;
  categoryId: string;
  isPublish: boolean;
  createdAt: string;
  category: Category;
}

export interface CreateProductData {
  name: string;
  description: string;
  image: ImageField;
  priceConfiguration: ProductPriceConfiguration;
  attributes: ProductAttribute[];
  tenantId: string;
  categoryId: string;
  isPublish: boolean;
}

export interface UpdateProductData {
  name?: string | undefined;
  description?: string | undefined;
  image?: ImageField | undefined;
  priceConfiguration?: ProductPriceConfiguration | undefined;
  attributes?: ProductAttribute[];
  tenantId?: string;
  categoryId?: string;
  isPublish?: boolean;
}

export interface ProductsQueryParams {
  perPage: number;
  currentPage: number;
  q: string;
  tenantId: string;
  categoryId: string;
  isPublish: boolean | undefined;
}

export interface GetProducts {
  currentPage: number;
  perPage: number;
  total: number;
  data: Product[];
}
