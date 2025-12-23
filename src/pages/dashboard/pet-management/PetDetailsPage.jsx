// src/pages/dashboard/pet-management/PetDetailsPage.jsx

import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  PawPrint,
  Calendar,
  Info,
  Heart,
  Image as ImageIcon,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

import { useGetPetQuery } from "../../../features/pet/petApiSlice";
import { defaultPetImages } from "../../../lib/mockData";

// ---------- Helpers ----------

const normalizePet = (pet) => {
  if (!pet) return null;

  return {
    id: pet.id,
    name: pet.name ?? "",
    gender: pet.gender ?? "",
    date_of_birth: pet.date_of_birth ?? "",
    description: pet.description ?? "",
    is_adoptable: !!pet.is_adoptable,
    breed_name: pet.pet_breed?.name ?? "",
    type_name: pet.pet_type?.name ?? "",
    images: pet.images ?? [],
  };
};

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;

  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) years--;
  return years >= 0 ? years : null;
};

const resolveImageSrc = (image) => {
  if (typeof image === "string") return image;
  try {
    return URL.createObjectURL(image);
  } catch {
    return null;
  }
};

const getPetImage = (pet) => {
  if (pet.images && pet.images.length > 0) {
    const src = resolveImageSrc(pet.images[0]);
    if (src) return src;
  }
  const key = pet.type_name?.toLowerCase();
  return defaultPetImages[key] || defaultPetImages.cat;
};

// ---------- Component ----------

const PetDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const petId = Number(id);

  const {
    data: petResponse,
    isLoading: isPetLoading,
    isError: isPetError,
  } = useGetPetQuery(petId, { skip: !petId });

  const pet = useMemo(() => {
    if (!petResponse) return null;
    const raw = petResponse.data ?? petResponse;
    return normalizePet(raw);
  }, [petResponse]);

  const age = pet ? calculateAge(pet.date_of_birth) : null;

  // Loading
  if (isPetLoading) {
    return (
      <div className="px-4 py-6 bg-slate-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-sm border border-slate-100 bg-white">
            <CardContent className="py-10">
              <p className="text-center text-gray-500">
                Loading pet details...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error
  if (isPetError) {
    return (
      <div className="px-4 py-6 bg-slate-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-sm border border-slate-100 bg-white">
            <CardContent className="py-10 space-y-4 text-center">
              <p className="text-red-500 font-medium">
                Failed to load pet details.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard/pet-management")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Not found
  if (!pet) {
    return (
      <div className="px-4 py-6 bg-slate-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-sm border border-slate-100 bg-white">
            <CardContent className="py-10 space-y-4 text-center">
              <p className="text-lg font-semibold text-slate-900">Pet not found</p>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                The pet you are trying to view does not exist or may have been removed.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard/pet-management")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const petImage = getPetImage(pet);

  return (
    <div className="px-4 py-6 bg-slate-50 min-h-screen">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Back button */}
        <div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50"
            onClick={() => navigate("/dashboard/pet-management")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pets
          </Button>
        </div>

        {/* Header card */}
        <Card className="shadow-sm border border-slate-100 bg-white/90 backdrop-blur-sm">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500/20 via-blue-500/5 to-blue-500/25 flex items-center justify-center border border-blue-100 shadow-sm overflow-hidden">
                  {petImage ? (
                    <img
                      src={petImage}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PawPrint className="w-7 h-7 text-blue-600" />
                  )}
                </div>
                <div
                  className={[
                    "absolute -right-1 -bottom-1 w-4 h-4 rounded-full border-2 border-white shadow-sm",
                    pet.is_adoptable ? "bg-emerald-500" : "bg-slate-400",
                  ].join(" ")}
                />
              </div>

              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-slate-900">
                  {pet.name || "Unnamed Pet"}
                </CardTitle>

                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-slate-500">
                  {pet.type_name && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {pet.type_name}
                    </span>
                  )}
                  {pet.breed_name && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {pet.breed_name}
                    </span>
                  )}
                  {pet.gender && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                      {pet.gender.toLowerCase()}
                    </span>
                  )}
                  {age != null && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {age} years old
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <Badge
                variant={pet.is_adoptable ? "success" : "secondary"}
                className={`flex items-center gap-1 px-3 py-1 text-xs md:text-sm ${
                  pet.is_adoptable
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <Heart className="w-3 h-3" />
                {pet.is_adoptable ? "Available for adoption" : "Not available"}
              </Badge>

              <div className="text-xs text-slate-500">
                ID: <span className="font-mono text-slate-700">#{pet.id}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Basic info card */}
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <CardTitle className="text-base font-semibold text-slate-900">
                Basic Information
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-sm">
            <DetailRow label="Name" value={pet.name} />
            <DetailRow label="Type" value={pet.type_name || "-"} />
            <DetailRow label="Breed" value={pet.breed_name || "-"} />
            <DetailRow
              label="Gender"
              value={
                pet.gender
                  ? pet.gender[0].toUpperCase() + pet.gender.slice(1).toLowerCase()
                  : "-"
              }
            />
            <DetailRow
              label="Date of Birth"
              value={pet.date_of_birth || "Not specified"}
              icon={<Calendar className="w-3 h-3" />}
            />
            <DetailRow
              label="Adoption Status"
              value={pet.is_adoptable ? "Available" : "Not available"}
            />
          </CardContent>
        </Card>

        {/* Photos card */}
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <CardTitle className="text-base font-semibold text-slate-900">
                Photos
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {pet.images && pet.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pet.images.map((image, index) => {
                  const src = resolveImageSrc(image);
                  if (!src) return null;

                  return (
                    <div
                      key={index}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                    >
                      <img
                        src={src}
                        alt={`${pet.name || "Pet"} photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">
                No photos uploaded for this pet yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Description card */}
        <Card className="shadow-sm border border-slate-100 bg-white mb-4">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-semibold text-slate-900">
              Description
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {pet.description ? (
              <p className="text-sm text-slate-700 leading-relaxed">{pet.description}</p>
            ) : (
              <p className="text-sm text-slate-400 italic">
                No description has been provided for this pet yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Row component
const DetailRow = ({ label, value, icon }) => (
  <div className="flex items-start justify-between gap-3 py-1.5 border-b border-dashed border-slate-100 last:border-b-0">
    <div className="flex items-center gap-1.5 text-slate-500">
      {icon}
      <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
    </div>
    <div className="text-right text-slate-800 text-sm max-w-[60%]">{value || "-"}</div>
  </div>
);

export default PetDetailsPage;
