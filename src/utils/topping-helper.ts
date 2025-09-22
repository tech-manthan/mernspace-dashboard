import type {
  CreateToppingData,
  UpdateToppingData,
} from "../types/topping.type";

export const makeToppingFormData = (
  data: CreateToppingData | UpdateToppingData
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "image") {
      formData.append(key, value);
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};
