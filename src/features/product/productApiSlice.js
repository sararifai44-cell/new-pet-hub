// src/features/product/productApiSlice.js
import { apiSlice } from "../../App/apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "admin/products",
      providesTags: (result) => {
        const list = result?.data ?? [];
        return [
          { type: "Product", id: "LIST" },
          ...list.map((p) => ({ type: "Product", id: p.id })),
        ];
      },
    }),

    getProduct: builder.query({
      query: (id) => `admin/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation({
      query: (formData) => ({
        url: "admin/products",
        method: "POST",
        body: formData, // ✅ FormData
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `admin/products/${id}`,
        method: "POST",
        body: formData, // ✅ FormData فيه _method=PATCH
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `admin/products/${id}`,
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
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApiSlice;
