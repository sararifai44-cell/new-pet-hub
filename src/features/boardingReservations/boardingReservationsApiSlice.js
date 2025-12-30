import { apiSlice } from "../../App/apiSlice";

const asArray = (res) => (Array.isArray(res?.data) ? res.data : []);
const pickData = (res) =>
  res && typeof res === "object" && "data" in res ? res.data : res;

export const boardingReservationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET /api/admin/boarding-reservations (index)
    getBoardingReservations: builder.query({
      query: () => ({
        url: "admin/boarding-reservations",
        method: "GET",
      }),
      providesTags: (result) => {
        const list = asArray(result);
        return [
          { type: "BoardingReservation", id: "LIST" },
          ...list.map((r) => ({ type: "BoardingReservation", id: r.id })),
        ];
      },
    }),

    // ✅ GET /api/admin/boarding-reservations/:id (show)
    getBoardingReservationById: builder.query({
      query: (id) => ({
        url: `admin/boarding-reservations/${id}`,
        method: "GET",
      }),
      transformResponse: (res) => pickData(res),
      providesTags: (_r, _e, id) => [{ type: "BoardingReservation", id }],
    }),

    // ✅ PATCH /api/admin/boarding-reservations/:id  body: { status }
    updateBoardingReservationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `admin/boarding-reservations/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "BoardingReservation", id: "LIST" },
        { type: "BoardingReservation", id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBoardingReservationsQuery,
  useGetBoardingReservationByIdQuery,
  useUpdateBoardingReservationStatusMutation,
} = boardingReservationsApiSlice;
