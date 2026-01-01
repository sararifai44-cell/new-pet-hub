// src/lib/validation/productFormSchema.js
import { z } from "zod";

export const productFormSchema = z.object({
  name_en: z.string().min(2, "English name must be at least 2 characters"),
  name_ar: z.string().min(2, "Arabic name must be at least 2 characters"),

  pet_type_id: z.string().min(1, "Please select a pet type"),

  product_category_id: z.string().min(1, "Please select a category"),

  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price must be greater than or equal to 0"),

  stock_quantity: z.coerce
    .number({ invalid_type_error: "Stock must be a number" })
    .int("Stock must be an integer")
    .min(0, "Stock must be greater than or equal to 0"),

  description: z.preprocess(
    (v) => (v == null ? "" : String(v)),
    z.string().optional()
  ),

  is_active: z.boolean().optional().default(true),
});

export const getProductDefaultValues = (initialData = {}) => {
  const catId =
    initialData.product_category_id ??
    initialData.category_id ??
    initialData.category?.id ??
    "";

  const typeId =
    initialData.pet_type_id ??
    initialData.type_id ??
    initialData.pet_type?.id ??
    "";

  return {
    name_en: initialData.name_en || "",
    name_ar: initialData.name_ar || "",
    pet_type_id: typeId ? String(typeId) : "",
    product_category_id: catId ? String(catId) : "",
    price: initialData.price ?? "",
    stock_quantity: initialData.stock_quantity ?? initialData.stock ?? 0,
    description:
      initialData.description == null ? "" : String(initialData.description),
    is_active:
      typeof initialData.is_active === "boolean" ? initialData.is_active : true,
  };
};
