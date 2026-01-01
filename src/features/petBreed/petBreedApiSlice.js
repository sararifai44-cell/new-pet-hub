// src/features/petBreed/petBreedApiSlice.js

import { apiSlice } from "../../app/apiSlice";

export const petBreedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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

    createPetBreed: builder.mutation({
      query: (data) => ({
        url: "admin/pet-breeds",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "PetBreed", id: "LIST" },
        { type: "PetType", id: "LIST" },
      ],
    }),

    updatePetBreed: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `admin/pet-breeds/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PetBreed", id: "LIST" },
        { type: "PetBreed", id },
        { type: "PetType", id: "LIST" },
      ],
    }),

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
