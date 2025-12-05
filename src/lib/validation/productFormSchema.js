// src/lib/validation/productFormSchema.js
import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? 0 : Number(val)))
    .refine((val) => !Number.isNaN(val) && val >= 0, {
      message: "Price must be a positive number",
    }),
  stock_quantity: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? 0 : Number(val)))
    .refine((val) => Number.isInteger(val) && val >= 0, {
      message: "Stock must be a non-negative integer",
    }),
  description: z.string().optional(),
  images: z.array(z.string()).max(5).optional(),
  is_active: z.boolean().default(true),
});
