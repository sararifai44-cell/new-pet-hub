import { apiSlice } from "../../App/apiSlice";

const asArray = (res) => (Array.isArray(res?.data) ? res.data : []);
const pickData = (res) =>
  res && typeof res === "object" && "data" in res ? res.data : res;

export const boardingReservationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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

    getBoardingReservationById: builder.query({
      query: (id) => ({
        url: `admin/boarding-reservations/${id}`,
        method: "GET",
      }),
      transformResponse: (res) => pickData(res),
      providesTags: (_r, _e, id) => [{ type: "BoardingReservation", id }],
    }),

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
