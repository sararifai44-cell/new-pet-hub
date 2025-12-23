// src/features/product/productApiSlice.js
import { apiSlice } from "../../App/apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/admin/products?page=1
    getProducts: builder.query({
      query: (page = 1) => `/admin/products?page=${page}`,
      providesTags: (result) =>
        result?.data
          ? [
              { type: "Product", id: "LIST" },
              ...result.data.map((p) => ({ type: "Product", id: p.id })),
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // ✅ GET /api/admin/products/:id (show)
    getProduct: builder.query({
      query: (id) => `/admin/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // POST /api/admin/products
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/admin/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // PATCH /api/admin/products/:id (partial update)
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    // DELETE /api/admin/products/:id
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductQuery, // ✅
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApiSlice;
