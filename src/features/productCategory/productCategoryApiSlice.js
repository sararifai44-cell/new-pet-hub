// src/features/productCategory/productCategoryApiSlice.js
import { apiSlice } from "../../App/apiSlice";

export const productCategoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductCategories: builder.query({
      query: () => "/admin/product-categories",
      providesTags: (result) =>
        result?.data
          ? [
              "ProductCategory",
              ...result.data.map((cat) => ({
                type: "ProductCategory",
                id: cat.id,
              })),
            ]
          : ["ProductCategory"],
    }),

    createProductCategory: builder.mutation({
      query: (body) => ({
        url: "/admin/product-categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ProductCategory"],
    }),

    updateProductCategory: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/product-categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "ProductCategory",
        { type: "ProductCategory", id },
      ],
    }),

    deleteProductCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/product-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "ProductCategory",
        { type: "ProductCategory", id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductCategoriesQuery,
  useCreateProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDeleteProductCategoryMutation,
} = productCategoryApiSlice;
