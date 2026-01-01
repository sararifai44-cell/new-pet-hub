// src/features/product/components/ProductForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, Image as ImageIcon, Package } from "lucide-react";

import {
  productFormSchema,
  getProductDefaultValues,
} from "../../../lib/validation/productFormSchema";

import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";

const normalizeExistingImages = (data) => {
  const arr = Array.isArray(data?.images) ? data.images : [];
  if (arr.length) {
    return arr
      .map((img) =>
        img && typeof img === "object" ? { id: img.id, url: img.url } : null
      )
      .filter(Boolean);
  }
  if (data?.cover_image) return [{ id: "cover", url: data.cover_image }];
  return [];
};

export default function ProductForm({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  categories = [],
  petTypes = [],
}) {
  const productId = initialData?.id ?? null;
  const isEdit = !!productId;

  const defaultValues = useMemo(() => getProductDefaultValues(initialData || {}), [productId]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const [existingImages, setExistingImages] = useState(
    normalizeExistingImages(initialData || {})
  );

  const [newImages, setNewImages] = useState([]); 

  const clearNewImages = () => {
    setNewImages((prev) => {
      prev.forEach((x) => x?.previewUrl && URL.revokeObjectURL(x.previewUrl));
      return [];
    });
  };

  useEffect(() => {
    reset(getProductDefaultValues(initialData || {}));
    setExistingImages(normalizeExistingImages(initialData || {}));
    clearNewImages();
  }, [productId, reset]);

  const totalImagesCount = existingImages.length + newImages.length;

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    const valid = files.filter(
      (file) => file.type?.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );

    if (totalImagesCount + valid.length > 5) {
      alert("You can only upload up to 5 images");
      return;
    }

    const mapped = valid.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...mapped]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => {
      const copy = [...prev];
      const item = copy[index];
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      copy.splice(index, 1);
      return copy;
    });
  };

  useEffect(() => {
    return () => {
      newImages.forEach((x) => x?.previewUrl && URL.revokeObjectURL(x.previewUrl));
    };
  }, []);

  const handleFormSubmit = (data) => {
    const fd = new FormData();

    if (isEdit) fd.append("_method", "PATCH");

    fd.append("pet_type_id", String(Number(data.pet_type_id)));
    fd.append("product_category_id", String(Number(data.product_category_id)));

    fd.append("name_en", String(data.name_en));
    fd.append("name_ar", String(data.name_ar));
    fd.append("price", String(Number(data.price)));
    fd.append("stock_quantity", String(Number(data.stock_quantity)));

    const desc = (data.description ?? "").toString().trim();
    if (desc.length > 0) fd.append("description", desc);

    fd.append("is_active", data.is_active ? "1" : "0");

    newImages.forEach(({ file }) => {
      if (file) fd.append("images[]", file);
    });

    onSubmit?.(fd);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* English name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Name (EN) <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            {...register("name_en")}
            placeholder="Enter English name"
            className={errors.name_en ? "border-red-300 bg-red-50" : ""}
          />
          {errors.name_en && (
            <p className="text-red-500 text-xs">{errors.name_en.message}</p>
          )}
        </div>

        {/* Arabic name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Name (AR) <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            {...register("name_ar")}
            placeholder="Enter Arabic name"
            className={errors.name_ar ? "border-red-300 bg-red-50" : ""}
          />
          {errors.name_ar && (
            <p className="text-red-500 text-xs">{errors.name_ar.message}</p>
          )}
        </div>

        {/* Pet Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Pet Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register("pet_type_id")}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.pet_type_id ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
          >
            <option value="">Select Pet Type</option>
            {(petTypes || []).map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {errors.pet_type_id && (
            <p className="text-red-500 text-xs">{errors.pet_type_id.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            {...register("product_category_id")}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.product_category_id ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
          >
            <option value="">Select Category</option>
            {(categories || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_en || c.name || c.name_ar}
              </option>
            ))}
          </select>
          {errors.product_category_id && (
            <p className="text-red-500 text-xs">{errors.product_category_id.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Price <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            {...register("price")}
            placeholder="0.00"
            className={errors.price ? "border-red-300 bg-red-50" : ""}
          />
          {errors.price && (
            <p className="text-red-500 text-xs">{errors.price.message}</p>
          )}
        </div>

        {/* Stock */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Stock Quantity <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            {...register("stock_quantity")}
            placeholder="0"
            className={errors.stock_quantity ? "border-red-300 bg-red-50" : ""}
          />
          {errors.stock_quantity && (
            <p className="text-red-500 text-xs">{errors.stock_quantity.message}</p>
          )}
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <ImageIcon size={16} />
          Product Images
        </label>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            id="product-images"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <label htmlFor="product-images" className="cursor-pointer">
            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-600 mb-1">
              Click to upload images
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, JPEG up to 5MB each (Max 5 images)
            </p>
          </label>
        </div>

        {(existingImages.length > 0 || newImages.length > 0) && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingImages.map((img) => (
                <div key={`ex-${img.id}`} className="relative">
                  <img
                    src={img.url}
                    alt="Product"
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              ))}

              {newImages.map((img, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={img.previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 text-center">
              {totalImagesCount} of 5 images selected
            </p>
          </>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Description (optional)
        </label>
        <Textarea
          {...register("description")}
          rows={4}
          placeholder="Optional description..."
          className="resize-none"
        />
      </div>

      {/* Active */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <input
          type="checkbox"
          {...register("is_active")}
          className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500 border-gray-300"
          id="active-checkbox"
        />
        <label htmlFor="active-checkbox" className="flex items-center gap-2 cursor-pointer text-sm">
          <Package size={16} className="text-blue-500" />
          Active product
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
        <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isEdit ? "Updating..." : "Adding..."}
            </>
          ) : isEdit ? (
            "Update Product"
          ) : (
            "Add Product"
          )}
        </Button>
      </div>
    </form>
  );
}
