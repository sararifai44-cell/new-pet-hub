// src/pages/dashboard/pet-management/EditPetPage.jsx

import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PawPrint } from "lucide-react";

import PetForm from "../../../features/pet/components/PetForm";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";

import {
  useGetPetsQuery,
  useUpdatePetMutation,
} from "../../../features/pet/petApiSlice";
import { useGetPetTypesQuery } from "../../../features/petType/petTypeApiSlice";
import { useGetPetBreedsQuery } from "../../../features/petBreed/petBreedApiSlice";

// ---------- Helpers خارج الكومبوننت ----------

const normalizePet = (found) => {
  if (!found) return null;

  return {
    pet_id: found.id,
    name: found.name ?? "",
    gender: found.gender ?? "",
    date_of_birth: found.date_of_birth ?? "",
    description: found.description ?? "",
    is_adoptable: !!found.is_adoptable,
    type_id: found.pet_type?.id ? String(found.pet_type.id) : "",
    breed_id: found.pet_breed?.id ? String(found.pet_breed.id) : "",
  };
};

const mapPetTypes = (petTypesResponse) => {
  if (!petTypesResponse) return [];
  const raw = petTypesResponse.data ?? petTypesResponse;

  return raw.map((t) => ({
    type_id: t.id,
    name: t.name,
  }));
};

const mapBreeds = (petBreedsResponse) => {
  if (!petBreedsResponse) return [];
  const raw = petBreedsResponse.data ?? petBreedsResponse;

  return raw.map((b) => {
    const typeId = b.pet_type_id ?? b.pet_type?.id ?? null;

    return {
      breed_id: b.id,
      name: b.name,
      type_id: typeId,
      pet_type_id: typeId,
    };
  });
};

// ---------- الكومبوننت الرئيسي ----------

const EditPetPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const petId = Number(id);

  const { data: petsResponse, isLoading: isPetsLoading } =
    useGetPetsQuery();

  const { data: petTypesResponse, isLoading: isTypesLoading } =
    useGetPetTypesQuery();

  const { data: petBreedsResponse, isLoading: isBreedsLoading } =
    useGetPetBreedsQuery();

  const [updatePet, { isLoading: isUpdating }] =
    useUpdatePetMutation();

  const pet = useMemo(() => {
    if (!petsResponse) return null;

    const raw = petsResponse.data ?? petsResponse;
    const found = raw.find((p) => p.id === petId);

    return normalizePet(found);
  }, [petsResponse, petId]);

  const petTypes = useMemo(
    () => mapPetTypes(petTypesResponse),
    [petTypesResponse]
  );

  const breeds = useMemo(
    () => mapBreeds(petBreedsResponse),
    [petBreedsResponse]
  );

  // هذا لزر السبميت فقط
  const isLoading =
    isPetsLoading || isTypesLoading || isBreedsLoading || isUpdating;

  const handleUpdatePet = async (dataFromForm) => {
    try {
      console.log("data from form (edit):", dataFromForm);

      const payload = {
        id: petId,
        ...dataFromForm,
        description: dataFromForm.description ?? "",
      };

      console.log("update payload:", payload);

      await updatePet(payload).unwrap();

      navigate("/dashboard/pet-management");
    } catch (error) {
      console.error("Failed to update pet:", error);
    }
  };

  // 🔹 حالة التحميل (أي داتا لسا ما وصلت)
  if (isPetsLoading || isTypesLoading || isBreedsLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-center text-gray-500">
          Loading pet data...
        </p>
      </div>
    );
  }

  // 🔹 حالة عدم وجود الحيوان
  if (!pet) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardContent className="py-10 flex flex-col items-center gap-3">
            <p className="text-lg font-semibold text-slate-900">
              Pet not found
            </p>
            <p className="text-sm text-slate-500 text-center max-w-md">
              The pet you are trying to edit does not exist or may have
              been removed.
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => navigate("/dashboard/pet-management")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
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

      {/* Page header card */}
      <Card className="shadow-sm border border-slate-100 bg-white/80">
        <CardHeader className="flex flex-col items-center gap-3 py-6">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 via-blue-500/5 to-blue-500/25 flex items-center justify-center border border-blue-100 shadow-sm">
              <PawPrint className="w-6 h-6 text-blue-600" />
            </div>
            <div className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-white" />
          </div>

          <div className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-slate-900">
              Edit Pet
            </CardTitle>
            <p className="text-sm text-slate-500">
              Update the information of the selected pet
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Form card */}
      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-xs">
              <PawPrint className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Pet Information
              </CardTitle>
              <p className="text-sm text-slate-500">
                Edit the basic information about the pet
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <PetForm
            initialData={pet}
            onSubmit={handleUpdatePet}
            isSubmitting={isLoading}
            petTypes={petTypes}
            breeds={breeds}
            showAdoptionOption={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPetPage;
