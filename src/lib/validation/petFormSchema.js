// src/lib/validation/petFormSchema.js
import { z } from "zod";

export const petFormSchema = z.object({
  name: z.string().min(2, "Pet name must be at least 2 characters"),
  type_id: z.string().min(1, "Please select a pet type"),
  breed_id: z.string().min(1, "Please select a breed"),
  date_of_birth: z.string().min(1, "Please select date of birth"),
  gender: z.string().min(1, "Please select gender"),
  description: z.string().optional(),
  is_adoptable: z.boolean().default(false),
});

export const getPetDefaultValues = (initialData = {}) => ({
  name: initialData.name || "",
  type_id: initialData.type_id || "",
  breed_id: initialData.breed_id || "",
  date_of_birth: initialData.date_of_birth || "",
  gender: initialData.gender || "",
  description: initialData.description || "",
  is_adoptable: initialData.is_adoptable || false,
});
