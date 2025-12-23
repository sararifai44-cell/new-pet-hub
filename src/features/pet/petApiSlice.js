// src/features/pet/petApiSlice.js
import { apiSlice } from "../../App/apiSlice";

export const petApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/admin/pets
    getPets: builder.query({
      query: () => "/admin/pets",
      providesTags: (result) => {
        const list = result?.data ?? [];
        return [
          { type: "Pet", id: "LIST" },
          ...list.map((pet) => ({ type: "Pet", id: pet.id })),
        ];
      },
    }),

    // ✅ GET /api/admin/pets/:id  (SHOW)
    getPet: builder.query({
      query: (id) => `/admin/pets/${id}`,
      providesTags: (result, error, id) => [{ type: "Pet", id }],
    }),

    // POST /api/admin/pets
    createPet: builder.mutation({
      query: (data) => ({
        url: "/admin/pets",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Pet", id: "LIST" }],
    }),

    // PATCH /api/admin/pets/:id
    updatePet: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/pets/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Pet", id },
        { type: "Pet", id: "LIST" },
      ],
    }),

    // DELETE /api/admin/pets/:id
    deletePet: builder.mutation({
      query: (id) => ({
        url: `/admin/pets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Pet", id },
        { type: "Pet", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPetsQuery,
  useGetPetQuery, // ✅ الجديد
  useCreatePetMutation,
  useUpdatePetMutation,
  useDeletePetMutation,
} = petApiSlice;
