import { apiSlice } from "../../App/apiSlice";

export const petApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPets: builder.query({
      query: () => "admin/pets",
      providesTags: (result) => {
        const list = result?.data ?? [];
        return [
          { type: "Pet", id: "LIST" },
          ...list.map((pet) => ({ type: "Pet", id: pet.id })),
        ];
      },
    }),

    getPet: builder.query({
      query: (id) => `admin/pets/${id}`,
      providesTags: (result, error, id) => [{ type: "Pet", id }],
    }),

    createPet: builder.mutation({
      query: (formData) => ({
        url: "admin/pets",
        method: "POST",
        body: formData, // FormData
      }),
      invalidatesTags: [{ type: "Pet", id: "LIST" }],
    }),

    updatePet: builder.mutation({
      query: ({ id, formData }) => ({
        url: `admin/pets/${id}`,
        method: "POST",
        body: formData, // FormData فيه _method=PATCH
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Pet", id },
        { type: "Pet", id: "LIST" },
      ],
    }),

    deletePet: builder.mutation({
      query: (id) => ({
        url: `admin/pets/${id}`,
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
  useGetPetQuery,
  useCreatePetMutation,
  useUpdatePetMutation,
  useDeletePetMutation,
} = petApiSlice;
