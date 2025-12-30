import { apiSlice } from "../../App/apiSlice";
export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: "/admin/orders",
      }),
      providesTags: (result) => {
        const list = result?.data ?? result ?? [];
        return [
          { type: "Order", id: "LIST" },
          ...list.map((o) => ({ type: "Order", id: o.id })),
        ];
      },
    }),

    getOrderById: builder.query({
      query: (id) => `/admin/orders/${id}`, // أو `/my/orders/${id}`
      providesTags: (result, err, id) => [{ type: "Order", id }],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, err, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),

    // ✅ إلغاء بدل حذف
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/orders/${id}/status`,
        method: "PATCH",
        body: { status: "cancelled" },
      }),
      invalidatesTags: (result, err, id) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = orderApiSlice;
