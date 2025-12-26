// src/features/pet/components/PetForm.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Upload, X, Image as ImageIcon, Heart } from "lucide-react";

import {
  petFormSchema,
  getPetDefaultValues,
} from "../../../lib/validation/petFormSchema";
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

const PetForm = ({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  petTypes = [],
  breeds = [],
  showAdoptionOption = true,
}) => {
  const petId = initialData?.id ?? initialData?.pet_id ?? null;

  const defaultValues = useMemo(() => {
    return getPetDefaultValues(initialData || {});
  }, [petId]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(petFormSchema),
    defaultValues,
  });

  // ✅ adoptable controlled value
  const isAdoptable = watch("is_adoptable");

  // صور DB
  const [existingImages, setExistingImages] = useState(
    normalizeExistingImages(initialData || {})
  );

  // صور جديدة
  const [newImages, setNewImages] = useState([]); // [{ file, previewUrl }]

  const clearNewImages = () => {
    setNewImages((prev) => {
      prev.forEach((x) => x?.previewUrl && URL.revokeObjectURL(x.previewUrl));
      return [];
    });
  };

  useEffect(() => {
    reset(getPetDefaultValues(initialData || {}));
    setExistingImages(normalizeExistingImages(initialData || {}));
    clearNewImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId, reset]);

  const typeId = watch("type_id");
  const prevTypeRef = useRef(undefined);

  useEffect(() => {
    if (prevTypeRef.current === undefined) {
      prevTypeRef.current = typeId;
      return;
    }
    if (prevTypeRef.current !== typeId) {
      setValue("breed_id", "");
      prevTypeRef.current = typeId;
    }
  }, [typeId, setValue]);

  const filteredBreeds = useMemo(() => {
    const tid = typeId ? Number(typeId) : null;
    return (breeds || []).filter((b) => {
      if (!tid) return true;
      const bt =
        b?.pet_type?.id ??
        b?.pet_type_id ??
        b?.type_id ??
        b?.petType?.id ??
        null;
      return Number(bt) === tid;
    });
  }, [breeds, typeId]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isEdit = !!petId;

  const handleFormSubmit = (data) => {
    const fd = new FormData();

    if (isEdit) fd.append("_method", "PATCH");

    fd.append("pet_type_id", String(Number(data.type_id)));
    fd.append("pet_breed_id", String(Number(data.breed_id)));

    fd.append("name", String(data.name));
    fd.append("gender", String(data.gender));
    fd.append("date_of_birth", String(data.date_of_birth));

    // ✅ nullable|string behavior:
    // - if empty on CREATE => don't send (backend sees null)
    // - if empty on EDIT and there was an old description => send "" to clear it
    const currentDesc =
      data.description == null ? "" : String(data.description).trim();

    const initialDesc =
      initialData?.description == null ? "" : String(initialData.description).trim();

    if (currentDesc) {
      fd.append("description", currentDesc);
    } else if (isEdit && initialDesc) {
      fd.append("description", "");
    }
    // else: do not append description

    // ✅ IMPORTANT: use controlled value to avoid RHF checkbox quirks on Add
    fd.append("is_adoptable", isAdoptable ? "1" : "0");

    newImages.forEach(({ file }) => {
      if (file) fd.append("images[]", file);
    });

    onSubmit?.(fd);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Pet Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            {...register("name")}
            placeholder="Enter pet name"
            className={errors.name ? "border-red-300 bg-red-50" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        {/* Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Pet Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register("type_id")}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.type_id ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
          >
            <option value="">Select Type</option>
            {(petTypes || []).map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {errors.type_id && (
            <p className="text-red-500 text-xs">{errors.type_id.message}</p>
          )}
        </div>

        {/* Breed */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Breed <span className="text-red-500">*</span>
          </label>
          <select
            {...register("breed_id")}
            disabled={!typeId}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.breed_id ? "border-red-300 bg-red-50" : "border-gray-300"
            } ${!typeId ? "bg-gray-50 text-gray-400" : ""}`}
          >
            <option value="">
              {typeId ? "Select Breed" : "Select type first"}
            </option>
            {filteredBreeds.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          {errors.breed_id && (
            <p className="text-red-500 text-xs">{errors.breed_id.message}</p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            {...register("gender")}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.gender ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-xs">{errors.gender.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <div className="max-w-xs">
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="date"
                {...register("date_of_birth")}
                className={`pl-10 ${
                  errors.date_of_birth ? "border-red-300 bg-red-50" : ""
                }`}
                lang="en"
              />
            </div>
          </div>
          {errors.date_of_birth && (
            <p className="text-red-500 text-xs">
              {errors.date_of_birth.message}
            </p>
          )}
          <p className="text-xs text-gray-500">
            Use Gregorian calendar (YYYY-MM-DD)
          </p>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <ImageIcon size={16} />
          Pet Photos
        </label>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            id="pet-images"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <label htmlFor="pet-images" className="cursor-pointer">
            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-600 mb-1">
              Click to upload images or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, JPEG up to 5MB each (Max 5 images)
            </p>
          </label>
        </div>

        {(existingImages.length > 0 || newImages.length > 0) && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Existing (DB) */}
              {existingImages.map((img) => (
                <div key={`ex-${img.id}`} className="relative">
                  <img
                    src={img.url}
                    alt="Pet"
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              ))}

              {/* New uploads */}
              {newImages.map((img, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={img.previewUrl}
                    alt={`Pet preview ${index + 1}`}
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
          Description
        </label>
        <Textarea
          {...register("description")}
          rows={4}
          placeholder="Describe the pet's personality, habits, special needs..."
          className={`resize-none ${
            errors.description ? "border-red-300 bg-red-50" : ""
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-xs">{errors.description.message}</p>
        )}
      </div>

      {/* ✅ Adoptable (controlled) */}
      {showAdoptionOption && (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            id="adoption-checkbox"
            checked={!!isAdoptable}
            onChange={(e) =>
              setValue("is_adoptable", e.target.checked, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500 border-gray-300"
          />
          <label
            htmlFor="adoption-checkbox"
            className="flex items-center gap-2 cursor-pointer text-sm"
          >
            <Heart size={16} className="text-blue-500" />
            Ready for Adoption
          </label>
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {isEdit ? "Updating..." : "Adding..."}
            </>
          ) : isEdit ? (
            "Update Pet"
          ) : (
            "Add Pet"
          )}
        </Button>
      </div>
    </form>
  );
};

export default PetForm;
