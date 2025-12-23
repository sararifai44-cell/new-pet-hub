  // src/features/pet/components/PetForm.jsx
  import React, { useState, useEffect } from "react";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { Calendar, Upload, X, Image, Heart } from "lucide-react";

  import {
    petFormSchema,
    getPetDefaultValues,
  } from "../../../lib/validation/petFormSchema";

  import { Input } from "../../../components/ui/input";
  import { Textarea } from "../../../components/ui/textarea";
  import { Button } from "../../../components/ui/button";

  const PetForm = ({
    initialData = {},
    onSubmit,
    isSubmitting = false,
    petTypes = [],
    breeds = [],
    showAdoptionOption = true,
  }) => {
    const [selectedType, setSelectedType] = useState(
      initialData.type_id || ""
    );
    const [petImages, setPetImages] = useState(
      initialData.images || []
    );

    const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(petFormSchema),
      defaultValues: getPetDefaultValues(initialData),
    });

    const watchedType = watch("type_id");

    useEffect(() => {
      setSelectedType(watchedType);
      if (watchedType !== selectedType) {
        setValue("breed_id", "");
      }
    }, [watchedType, setValue, selectedType]);

    const filteredBreeds = breeds.filter((breed) =>
      selectedType ? breed.type_id === parseInt(selectedType) : true
    );

    const handleImageUpload = (event) => {
      const files = Array.from(event.target.files);
      const validImages = files.filter(
        (file) =>
          file.type.startsWith("image/") &&
          file.size <= 5 * 1024 * 1024
      );

      if (validImages.length + petImages.length > 5) {
        alert("You can only upload up to 5 images");
        return;
      }

      setPetImages((prev) => [...prev, ...validImages]);
    };

    const removeImage = (index) => {
      setPetImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFormSubmit = (data) => {
      const payload = {
        ...data,
        pet_type_id: data.type_id ? Number(data.type_id) : null,
        pet_breed_id: data.breed_id ? Number(data.breed_id) : null,
        gender: data.gender,
        images: petImages,
      };

      onSubmit(payload);
    };

    return (
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Pet Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              {...register("name")}
              placeholder="Enter pet name"
              className={
                errors.name ? "border-red-300 bg-red-50" : ""
              }
            />
            {errors.name && (
              <p className="text-red-500 text-xs">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Pet Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register("type_id")}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.type_id
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select Type</option>
              {petTypes.map((type) => (
                <option key={type.type_id} value={type.type_id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.type_id && (
              <p className="text-red-500 text-xs">
                {errors.type_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Breed <span className="text-red-500">*</span>
            </label>
            <select
              {...register("breed_id")}
              disabled={!selectedType}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.breed_id
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              } ${!selectedType ? "bg-gray-50 text-gray-400" : ""}`}
            >
              <option value="">
                {selectedType ? "Select Breed" : "Select type first"}
              </option>
              {filteredBreeds.map((breed) => (
                <option
                  key={breed.breed_id}
                  value={breed.breed_id}
                >
                  {breed.name}
                </option>
              ))}
            </select>
            {errors.breed_id && (
              <p className="text-red-500 text-xs">
                {errors.breed_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              {...register("gender")}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.gender
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs">
                {errors.gender.message}
              </p>
            )}
          </div>

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
                    errors.date_of_birth
                      ? "border-red-300 bg-red-50"
                      : ""
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

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Image size={16} />
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
              <Upload
                className="mx-auto text-gray-400 mb-2"
                size={32}
              />
              <p className="text-sm text-gray-600 mb-1">
                Click to upload images or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, JPEG up to 5MB each (Max 5 images)
              </p>
            </label>
          </div>

          {petImages.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {petImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt={`Pet preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center">
                {petImages.length} of 5 images uploaded
              </p>
            </>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            {...register("description")}
            rows={4}
            placeholder="Describe the pet's personality, habits, special needs..."
            className="resize-none"
          />
        </div>

        {showAdoptionOption && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              {...register("is_adoptable")}
              className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500 border-gray-300"
              id="adoption-checkbox"
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

        <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {initialData.pet_id ? "Updating..." : "Adding..."}
              </>
            ) : initialData.pet_id ? (
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
