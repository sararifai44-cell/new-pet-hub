import { apiSlice } from "../../App/apiSlice";

const asArray = (res) => (Array.isArray(res?.data) ? res.data : []);

export const petAdoptionApplicationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET /api/admin/adoption-applications/pet/:petId
    getAdoptionApplicationsByPetId: builder.query({
      query: (petId) => ({
        url: `admin/adoption-applications/pet/${petId}`,
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
  }),
  overrideExisting: false,
});

export const { useGetAdoptionApplicationsByPetIdQuery } =
  petAdoptionApplicationsApiSlice;
