import type {
  CreateProductData,
  UpdateProductData,
} from "../types/product.type";

export const makeProductFormData = (
  data: CreateProductData | UpdateProductData
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "image") {
      formData.append(key, value);
    } else if (key === "priceConfiguration" || key === "attributes") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};
