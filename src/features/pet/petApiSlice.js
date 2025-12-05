// src/features/pet/petApiSlice.js
import { apiSlice } from "../../App/apiSlice";

export const petApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/admin/pets
    getPets: builder.query({
      query: () => "/admin/pets",
      providesTags: (result) =>
        result?.data
          ? ["Pet", ...result.data.map((pet) => ({ type: "Pet", id: pet.id }))]
          : ["Pet"],
    }),

    // POST /api/admin/pets
    createPet: builder.mutation({
      query: (data) => ({
        url: "/admin/pets",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pet"],
    }),

    // PUT /api/admin/pets/:id
    updatePet: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/pets/${id}`,
        method: "PUT", // أو PATCH لو هيك عندك بالباك
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Pet", { type: "Pet", id }],
    }),

    // DELETE /api/admin/pets/:id
    deletePet: builder.mutation({
      query: (id) => ({
        url: `/admin/pets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => ["Pet", { type: "Pet", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPetsQuery,
  useCreatePetMutation,
  useUpdatePetMutation,
  useDeletePetMutation,
} = petApiSlice;
