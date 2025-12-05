// src/features/product/productApiSlice.js
import { apiSlice } from "../../app/apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/admin/products
    getProducts: builder.query({
      query: () => "admin/products",
      providesTags: (result) =>
        result?.data
          ? [
              { type: "Product", id: "LIST" },
              ...result.data.map((product) => ({
                type: "Product",
                id: product.id,
              })),
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: "admin/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `admin/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id: "LIST" },
        { type: "Product", id },
      ],
    }),

    // DELETE /api/admin/products/:id
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id: "LIST" },
        { type: "Product", id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApiSlice;
