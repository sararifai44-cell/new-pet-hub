// src/features/petType/petTypeApiSlice.js
import { apiSlice } from "../../app/apiSlice";

export const petTypeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/admin/pet-types
    getPetTypes: builder.query({
      query: () => "admin/pet-types",
      providesTags: (result) =>
        result?.data
          ? [
              // تاغ عام للقائمة كلها
              { type: "PetType", id: "LIST" },
              // وتاغ لكل نوع لحاله لو حبيت تستخدمه لاحقاً
              ...result.data.map((t) => ({
                type: "PetType",
                id: t.id,
              })),
            ]
          : [{ type: "PetType", id: "LIST" }],
    }),

    // POST /api/admin/pet-types
    createPetType: builder.mutation({
      query: (data) => ({
        url: "admin/pet-types",
        method: "POST",
        body: data,
      }),
      // بعد الإضافة → رجّع نداء getPetTypes
      invalidatesTags: [{ type: "PetType", id: "LIST" }],
    }),

    // PUT /api/admin/pet-types/:id
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

    // DELETE /api/admin/pet-types/:id
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

// تصدير الهوكس الجاهزة
export const {
  useGetPetTypesQuery,
  useCreatePetTypeMutation,
  useUpdatePetTypeMutation,
  useDeletePetTypeMutation,
} = petTypeApiSlice;
