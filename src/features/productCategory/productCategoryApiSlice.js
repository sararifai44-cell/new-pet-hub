// src/features/productCategory/productCategoryApiSlice.js
import { apiSlice } from "../../App/apiSlice";

export const productCategoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/admin/product-categories
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

    // POST /api/admin/product-categories
    createProductCategory: builder.mutation({
      query: (body) => ({
        url: "/admin/product-categories",
        method: "POST",
        body, // { name_en, name_ar, name }
      }),
      invalidatesTags: ["ProductCategory"],
    }),

    // PATCH /api/admin/product-categories/:id  (partial update زي ما قلت)
    updateProductCategory: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/product-categories/${id}`,
        method: "PATCH",
        body, // { name_en?, name_ar?, name? }
      }),
      invalidatesTags: (result, error, { id }) => [
        "ProductCategory",
        { type: "ProductCategory", id },
      ],
    }),

    // DELETE /api/admin/product-categories/:id
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
