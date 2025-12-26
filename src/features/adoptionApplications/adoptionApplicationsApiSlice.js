import { apiSlice } from "../../App/apiSlice";
const asArray = (res) => (Array.isArray(res?.data) ? res.data : []);
const pickData = (res) =>
  res && typeof res === "object" && "data" in res ? res.data : res;

export const adoptionApplicationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET /api/admin/adoption-applications (index)
    getAdoptionApplications: builder.query({
      query: () => ({
        url: "admin/adoption-applications",
        method: "GET",
      }),
      providesTags: (result) => {
        const list = asArray(result);
        return [
          { type: "AdoptionApplication", id: "LIST" },
          ...list.map((a) => ({ type: "AdoptionApplication", id: a.id })),
        ];
      },
    }),

    // ✅ GET /api/admin/adoption-applications/:id (show)
    getAdoptionApplicationById: builder.query({
      query: (id) => ({
        url: `admin/adoption-applications/${id}`,
        method: "GET",
      }),
      transformResponse: (res) => pickData(res),
      providesTags: (_r, _e, id) => [{ type: "AdoptionApplication", id }],
    }),

    // ✅ PATCH /api/admin/adoption-applications/:id
    updateAdoptionApplicationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `admin/adoption-applications/${id}`,
        method: "PATCH",
        body: { status }, // مثال: { status: "rejected" }
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "AdoptionApplication", id: "LIST" },
        { type: "AdoptionApplication", id },
      ],
    }),

    // ✅ DELETE /api/admin/adoption-applications/:id
    deleteAdoptionApplication: builder.mutation({
      query: (id) => ({
        url: `admin/adoption-applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "AdoptionApplication", id: "LIST" },
        { type: "AdoptionApplication", id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdoptionApplicationsQuery,
  useGetAdoptionApplicationByIdQuery,
  useUpdateAdoptionApplicationStatusMutation,
  useDeleteAdoptionApplicationMutation,
} = adoptionApplicationsApiSlice;
