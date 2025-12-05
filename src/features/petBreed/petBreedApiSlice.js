// src/features/petBreed/petBreedApiSlice.js

import { apiSlice } from "../../app/apiSlice";

export const petBreedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🟣 GET /api/admin/pet-breeds (لو حبيت تستخدمه بمكان تاني)
    getPetBreeds: builder.query({
      query: () => "admin/pet-breeds",
      providesTags: (result) =>
        result?.data
          ? [
              { type: "PetBreed", id: "LIST" },
              ...result.data.map((breed) => ({
                type: "PetBreed",
                id: breed.id,
              })),
            ]
          : [{ type: "PetBreed", id: "LIST" }],
    }),

    // 🟢 POST /api/admin/pet-breeds
    createPetBreed: builder.mutation({
      query: (data) => ({
        url: "admin/pet-breeds",
        method: "POST",
        body: data,
      }),
      // ✅ مهم: بدنا نرجّع جلب pet-types كمان لأن breeds جاية جوّاته
      invalidatesTags: [
        { type: "PetBreed", id: "LIST" },
        { type: "PetType", id: "LIST" },
      ],
    }),

    // 🟡 PUT /api/admin/pet-breeds/:id
    updatePetBreed: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `admin/pet-breeds/${id}`,
        method: "PUT", // لو عامل PATCH بالباك اند غيّرها
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PetBreed", id: "LIST" },
        { type: "PetBreed", id },
        // برضو خليه يرجّع جلب pet-types
        { type: "PetType", id: "LIST" },
      ],
    }),

    // 🔴 DELETE /api/admin/pet-breeds/:id
    deletePetBreed: builder.mutation({
      query: (id) => ({
        url: `admin/pet-breeds/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "PetBreed", id: "LIST" },
        { type: "PetBreed", id },
        { type: "PetType", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPetBreedsQuery,
  useCreatePetBreedMutation,
  useUpdatePetBreedMutation,
  useDeletePetBreedMutation,
} = petBreedApiSlice;
