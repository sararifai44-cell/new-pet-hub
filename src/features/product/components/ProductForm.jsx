import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { productFormSchema } from "../../../lib/validation/productFormSchema";

// shadcn ui
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";

import { UploadCloud, Image as ImageIcon } from "lucide-react";

const DEFAULT_CATEGORY_OPTIONS = [
  "Food",
  "Toys",
  "Accessories",
  "Beds",
  "Health & Care",
  "Grooming",
];

const ProductForm = ({
  mode = "create", // "create" | "edit" | "view"
  initialData = {},
  onSubmit,
  isSubmitting = false,
  categories = [], // 👈 تجي من AddProductPage
}) => {
  const isReadOnly = mode === "view";

  const defaultValues = {
    name: initialData.name || "",
    category: initialData.category || "",
    price:
      typeof initialData.price === "number"
        ? initialData.price
        : initialData.price || "",
    stock_quantity:
      typeof initialData.stock_quantity === "number"
        ? initialData.stock_quantity
        : initialData.stock_quantity || "",
    description: initialData.description || "",
    images: initialData.images || [],
    is_active:
      typeof initialData.is_active === "boolean"
        ? initialData.is_active
        : true,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const [imagePreviews, setImagePreviews] = useState(defaultValues.images);
  const currentImages = watch("images");

  const handleImagesSelected = async (event) => {
    if (isReadOnly) return;

    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const remaining = 5 - (imagePreviews?.length || 0);
    if (remaining <= 0) return;

    const selected = files.slice(0, remaining);

    const readAsDataUrl = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve(typeof reader.result === "string" ? reader.result : "");
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    try {
      const dataUrls = await Promise.all(selected.map(readAsDataUrl));
      const nextImages = [...(currentImages || []), ...dataUrls];

      setImagePreviews(nextImages);
      setValue("images", nextImages, { shouldValidate: true });
    } catch (e) {
      console.error("Failed to read images", e);
    } finally {
      event.target.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    if (isReadOnly) return;
    const next = (currentImages || []).filter((_, i) => i !== index);
    setImagePreviews(next);
    setValue("images", next, { shouldValidate: true });
  };

  const submitHandler = (values) => {
    if (!onSubmit) return;
    onSubmit(values);
  };

  // 👈 إذا جتنا categories من فوق نستخدمها، غير هيك fallback للـ DEFAULT_CATEGORY_OPTIONS
  const categoryOptions =
    categories && categories.length > 0 ? categories : DEFAULT_CATEGORY_OPTIONS;

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6"
      noValidate
    >
      {/* الحقول الأساسية */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">Product name</Label>
          <Input
            id="name"
            placeholder="e.g. Cat Scratching Post"
            disabled={isSubmitting || isReadOnly}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500">
              {errors.name.message?.toString()}
            </p>
          )}
        </div>

        {/* Category (dropdown) */}
        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            disabled={isSubmitting || isReadOnly}
            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register("category")}
          >
            <option value="">Select category</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-500">
              {errors.category.message?.toString()}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g. 19.99"
            disabled={isSubmitting || isReadOnly}
            {...register("price")}
          />
        </div>

        {/* Stock */}
        <div className="space-y-1.5">
          <Label htmlFor="stock_quantity">Stock quantity</Label>
          <Input
            id="stock_quantity"
            type="number"
            min="0"
            placeholder="e.g. 10"
            disabled={isSubmitting || isReadOnly}
            {...register("stock_quantity")}
          />
        </div>

        {errors.price && (
          <p className="text-xs text-red-500 md:col-span-1">
            {errors.price.message?.toString()}
          </p>
        )}
        {errors.stock_quantity && (
          <p className="text-xs text-red-500 md:col-span-1">
            {errors.stock_quantity.message?.toString()}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Short description about the product..."
          disabled={isSubmitting || isReadOnly}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">
            {errors.description.message?.toString()}
          </p>
        )}
      </div>

      {/* Images upload */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Product Images{" "}
          <span className="text-xs text-slate-500">(Max 5 images)</span>
        </Label>

        <label className="mt-1 flex flex-col items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-xl px-4 py-8 text<center bg-slate-50/40 hover:bg-slate-50 cursor-pointer transition">
          <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
          <p className="text-sm text-slate-700">
            Click to upload images or drag and drop
          </p>
          <p className="text-xs text-slate-400 mt-1">
            PNG, JPG up to 5MB each (Max 5 images)
          </p>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImagesSelected}
            disabled={isSubmitting || isReadOnly}
          />
        </label>

        {imagePreviews && imagePreviews.length > 0 && (
          <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {imagePreviews.map((src, index) => (
              <div
                key={index}
                className="relative group rounded-lg border border-slate-200 bg-white overflow-hidden"
              >
                <img
                  src={src}
                  alt={`Product ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 rounded-full bg-black/60 text-white text-[11px] px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {errors.images && (
          <p className="text-xs text-red-500">
            {errors.images.message?.toString()}
          </p>
        )}
      </div>

      {/* Active product */}
      <div className="pt-2">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            id="is_active"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-red-500 focus:ring-red-500"
            disabled={isSubmitting || isReadOnly}
            {...register("is_active")}
          />
          <label
            htmlFor="is_active"
            className="flex flex-col cursor-pointer"
          >
            <span className="text-sm font-medium text-slate-900">
              Active product
            </span>
            <span className="text-xs text-slate-500">
              If unchecked, this product will be hidden from the shop.
            </span>
          </label>
        </div>
      </div>

      {mode !== "view" && (
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "edit"
              ? "Save changes"
              : "Create product"}
          </Button>
        </div>
      )}
    </form>
  );
};

export default ProductForm;
