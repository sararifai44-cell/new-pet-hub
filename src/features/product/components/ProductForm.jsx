// src/features/product/components/ProductForm.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  productFormSchema,
  getProductDefaultValues,
} from "../../../lib/validation/productFormSchema";

import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";

const ProductForm = ({
  initialData = {},
  categories = [],
  onSubmit,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: getProductDefaultValues(initialData),
  });

  const handleFormSubmit = (data) => {
    // ✅ خلّي الفورم يطلع payload موحّد (خصوصاً للـ create)
    const payload = {
      name_en: data.name_en,
      name_ar: data.name_ar,
      product_category_id: Number(data.product_category_id),
      price: Number(data.price),

      // ✅ بدل stock -> stock_quantity
      stock_quantity: Number(data.stock_quantity),

      description: data.description ?? "",
      is_active: !!data.is_active,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Product Name (EN) <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            {...register("name_en")}
            placeholder="e.g. Cat Food"
            className={errors.name_en ? "border-red-300 bg-red-50" : ""}
          />
          {errors.name_en && (
            <p className="text-red-500 text-xs">{errors.name_en.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            اسم المنتج (AR) <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            {...register("name_ar")}
            placeholder="مثال: أكل قطط"
            className={errors.name_ar ? "border-red-300 bg-red-50" : ""}
          />
          {errors.name_ar && (
            <p className="text-red-500 text-xs">{errors.name_ar.message}</p>
          )}
        </div>
      </div>

      {/* Category + Price + Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            {...register("product_category_id")}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.product_category_id
                ? "border-red-300 bg-red-50"
                : "border-gray-300"
            }`}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name_en} / {cat.name_ar}
              </option>
            ))}
          </select>
          {errors.product_category_id && (
            <p className="text-red-500 text-xs">
              {errors.product_category_id.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Price <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            {...register("price")}
            placeholder="e.g. 12.00"
            className={errors.price ? "border-red-300 bg-red-50" : ""}
          />
          {errors.price && (
            <p className="text-red-500 text-xs">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            min="0"
            // ✅ بدل stock -> stock_quantity
            {...register("stock_quantity")}
            placeholder="e.g. 5"
            className={errors.stock_quantity ? "border-red-300 bg-red-50" : ""}
          />
          {errors.stock_quantity && (
            <p className="text-red-500 text-xs">
              {errors.stock_quantity.message}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          {...register("description")}
          rows={4}
          placeholder="Describe the product (usage, size, etc.)"
          className="resize-none"
        />
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <input
          type="checkbox"
          {...register("is_active")}
          id="active-checkbox"
          className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500 border-gray-300"
        />
        <label htmlFor="active-checkbox" className="text-sm cursor-pointer">
          Product is active / visible in store
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
        <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {initialData.id ? "Updating..." : "Adding..."}
            </>
          ) : initialData.id ? (
            "Update Product"
          ) : (
            "Add Product"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
