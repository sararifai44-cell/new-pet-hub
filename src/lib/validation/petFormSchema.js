import { z } from "zod";

export const petFormSchema = z.object({
  name: z.string().min(2, "Pet name must be at least 2 characters"),
  type_id: z.string().min(1, "Please select a pet type"),
  breed_id: z.string().min(1, "Please select a breed"),
  date_of_birth: z.string().min(1, "Please select date of birth"),

  gender: z.enum(["male", "female"], {
    required_error: "Please select gender",
    invalid_type_error: "Please select gender",
  }),

  description: z.preprocess((v) => {
    if (v == null) return null;
    const s = String(v).trim();
    return s === "" ? null : s;
  }, z.string().nullable().optional()),

  is_adoptable: z.boolean().default(false),
});

export const getPetDefaultValues = (initialData = {}) => {
  const typeId =
    initialData?.pet_type?.id ??
    initialData?.pet_type_id ??
    initialData?.type_id ??
    "";

  const breedId =
    initialData?.pet_breed?.id ??
    initialData?.pet_breed_id ??
    initialData?.breed_id ??
    "";

  return {
    name: initialData?.name || "",
    type_id: typeId ? String(typeId) : "",
    breed_id: breedId ? String(breedId) : "",
    date_of_birth: initialData?.date_of_birth || "",

    gender: initialData?.gender ? String(initialData.gender).toLowerCase() : "",

    description:
      initialData?.description == null ? "" : String(initialData.description),

    is_adoptable: !!initialData?.is_adoptable,
  };
};
