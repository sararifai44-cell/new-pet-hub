import { apiSlice } from "../../App/apiSlice";

const asArray = (res) => (Array.isArray(res?.data) ? res.data : []);
const pickData = (res) =>
  res && typeof res === "object" && "data" in res ? res.data : res;

const normalizeServicePayload = (payload) => {
  const out = { ...payload };

  if ("is_active" in out) {
    out.is_active = out.is_active ? 1 : 0;
  }
  return out;
};

export const boardingServicesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBoardingServices: builder.query({
      query: () => ({
        url: "admin/boarding-services",
        method: "GET",
      }),
      providesTags: (result) => {
        const list = asArray(result);
        return [
          { type: "BoardingService", id: "LIST" },
          ...list.map((s) => ({ type: "BoardingService", id: s.id })),
        ];
      },
    }),

    createBoardingService: builder.mutation({
      query: (payload) => ({
        url: "admin/boarding-services",
        method: "POST",
        body: normalizeServicePayload(payload),
      }),
      invalidatesTags: [{ type: "BoardingService", id: "LIST" }],
      transformResponse: (res) => pickData(res),
    }),

    updateBoardingService: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `admin/boarding-services/${id}`,
        method: "PATCH",
        body: normalizeServicePayload(patch),
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "BoardingService", id: "LIST" },
        { type: "BoardingService", id },
      ],
      transformResponse: (res) => pickData(res),
    }),

    deleteBoardingService: builder.mutation({
      query: (id) => ({
        url: `admin/boarding-services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "BoardingService", id: "LIST" },
        { type: "BoardingService", id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBoardingServicesQuery,
  useCreateBoardingServiceMutation,
  useUpdateBoardingServiceMutation,
  useDeleteBoardingServiceMutation,
} = boardingServicesApiSlice;
