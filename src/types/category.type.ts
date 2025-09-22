import type { PriceType } from "./common.type";

export type CategoryWidgetType = "switch" | "radio";

export interface CategoryPriceConfigurationValue {
  priceType: PriceType;
  availableOptions: string[];
}

export interface CategoryPriceConfiguration {
  [key: string]: CategoryPriceConfigurationValue;
}

export interface CategoryAttribute {
  name: string;
  widgetType: CategoryWidgetType;
  defaultValue: string;
  availableOptions: string[];
}

export interface Category {
  _id: string;
  name: string;
  priceConfiguration: CategoryPriceConfiguration;
  attributes: CategoryAttribute[];
  createdAt: Date;
}

export interface CreateCatgoryData {
  name: string;
  priceConfiguration: CategoryPriceConfiguration;
  attributes: CategoryAttribute[];
}

export interface UpdateCatgoryData {
  name?: string | undefined;
  priceConfiguration?: CategoryPriceConfiguration | undefined;
  attributes?: CategoryAttribute[] | undefined;
}

export interface GetCategories {
  currentPage: number;
  perPage: number;
  total: number;
  data: Category[];
}

export interface CategoriesQueryParams {
  perPage: number;
  currentPage: number;
  q: string;
}
