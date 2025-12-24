// src/pages/dashboard/pet-management/PetDetailsPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Image as ImageIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

import { useGetPetQuery } from "../../../features/pet/petApiSlice";

export default function PetDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const petId = Number(id);

  const { data: petRes, isLoading, isError } = useGetPetQuery(petId);
  const pet = petRes?.data ?? null;

  const images = useMemo(() => {
    const arr = Array.isArray(pet?.images) ? pet.images : [];
    return arr
      .map((x) => (x && typeof x === "object" ? x.url : null))
      .filter(Boolean);
  }, [pet]);

  const cover = pet?.cover_image || images[0] || "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate("/dashboard/pet-management/pets")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Button onClick={() => navigate(`/dashboard/pet-management/pets/${petId}/edit`)}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pet Details</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading && <div className="text-sm text-gray-500">Loading...</div>}
          {isError && <div className="text-sm text-red-600">Failed to load</div>}

          {!isLoading && pet && (
            <div className="space-y-6">
              {/* Cover */}
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                {cover ? (
                  <img src={cover} alt={pet.name} className="w-full h-64 object-cover" />
                ) : (
                  <div className="w-full h-64 grid place-items-center text-gray-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {images.map((url, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden border border-gray-200">
                      <img src={url} alt={`pet-${idx}`} className="w-full h-24 object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Name</div>
                  <div className="text-sm font-semibold">{pet.name}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Gender</div>
                  <div className="text-sm font-semibold capitalize">{pet.gender || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Type</div>
                  <div className="text-sm font-semibold">
                    {pet?.pet_type?.name || "-"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Breed</div>
                  <div className="text-sm font-semibold">
                    {pet?.pet_breed?.name || "-"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Date of Birth</div>
                  <div className="text-sm font-semibold">{pet.date_of_birth || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Adoptable</div>
                  <Badge
                    variant="outline"
                    className={
                      pet.is_adoptable
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    }
                  >
                    {pet.is_adoptable ? "Available" : "Not Available"}
                  </Badge>
                </div>

                <div className="md:col-span-2">
                  <div className="text-xs text-gray-500">Description</div>
                  <div className="text-sm font-semibold">
                    {pet.description ?? "-"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
