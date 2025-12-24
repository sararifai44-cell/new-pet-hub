import React from "react";
import { Eye, Edit3, Heart, Image as ImageIcon } from "lucide-react";

const pickImageUrl = (pet) => {
  // index: cover_image (string)
  if (pet?.cover_image) return pet.cover_image;

  // fallback لو في images array بأي response
  const img = Array.isArray(pet?.images) ? pet.images[0] : null;
  if (!img) return "";
  if (typeof img === "string") return img;
  if (typeof img === "object") return img.url || img.original_url || img.preview_url || "";
  return "";
};

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return "-";
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return "-";

  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) years--;
  return years >= 0 ? years : "-";
};

const PetCard = ({
  pet,
  onViewDetails,
  onEdit,
  onToggleAdoption,
  showActions = true,
}) => {
  const imgUrl = pickImageUrl(pet);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Pet Image */}
      <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400">
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs">No image</span>
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              pet.is_adoptable
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {pet.is_adoptable ? "Available" : "Not Available"}
          </span>
        </div>
      </div>

      {/* Pet Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{pet.name}</h3>
            <p className="text-gray-600 text-sm capitalize">
              {pet.gender?.toLowerCase?.() || "-"} • {calculateAge(pet.date_of_birth)} years
            </p>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">{pet.breed?.type?.name}</span>
            {pet.breed?.name && ` • ${pet.breed.name}`}
          </p>
          {pet.owner && (
            <p className="text-xs text-gray-500 mt-1">
              Owner: {pet.owner.full_name}
            </p>
          )}
        </div>

        {pet.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {pet.description}
          </p>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex gap-2">
              <button
                onClick={onViewDetails}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View Details"
              >
                <Eye size={20} />
              </button>
              <button
                onClick={onEdit}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Edit Pet"
              >
                <Edit3 size={20} />
              </button>
            </div>

            <button
              onClick={onToggleAdoption}
              className={`p-2 rounded-lg transition-colors ${
                pet.is_adoptable
                  ? "text-red-600 hover:bg-red-50"
                  : "text-green-600 hover:bg-green-50"
              }`}
              title={
                pet.is_adoptable ? "Mark as Not Available" : "Mark as Available"
              }
            >
              <Heart
                size={18}
                fill={pet.is_adoptable ? "currentColor" : "none"}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetCard;
