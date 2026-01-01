// src/features/petType/petTypeApiSlice.js
import { apiSlice } from "../../app/apiSlice";

export const petTypeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPetTypes: builder.query({
      query: () => "admin/pet-types",
      providesTags: (result) =>
        result?.data
          ? [
              { type: "PetType", id: "LIST" },
              ...result.data.map((t) => ({
                type: "PetType",
                id: t.id,
              })),
            ]
          : [{ type: "PetType", id: "LIST" }],
    }),

    createPetType: builder.mutation({
      query: (data) => ({
        url: "admin/pet-types",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "PetType", id: "LIST" }],
    }),

    updatePetType: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `admin/pet-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PetType", id: "LIST" },
        { type: "PetType", id },
      ],
    }),

    deletePetType: builder.mutation({
      query: (id) => ({
        url: `admin/pet-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "PetType", id: "LIST" },
        { type: "PetType", id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPetTypesQuery,
  useCreatePetTypeMutation,
  useUpdatePetTypeMutation,
  useDeletePetTypeMutation,
} = petTypeApiSlice;
