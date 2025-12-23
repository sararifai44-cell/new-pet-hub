// src/pages/dashboard/pet-management/AddPetPage.jsx

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PawPrint } from "lucide-react";

import PetForm from "../../../features/pet/components/PetForm";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";

import { useCreatePetMutation } from "../../../features/pet/petApiSlice";
import { useGetPetTypesQuery } from "../../../features/petType/petTypeApiSlice";
import { useGetPetBreedsQuery } from "../../../features/petBreed/petBreedApiSlice";

// ---------- Helpers خارج الكومبوننت ----------

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

const AddPetPage = () => {
  const navigate = useNavigate();

  const { data: petTypesResponse, isLoading: isTypesLoading } =
    useGetPetTypesQuery();

  const { data: petBreedsResponse, isLoading: isBreedsLoading } =
    useGetPetBreedsQuery();

  const [createPet, { isLoading: isSubmitting }] =
    useCreatePetMutation();

  const petTypes = useMemo(
    () => mapPetTypes(petTypesResponse),
    [petTypesResponse]
  );

  const breeds = useMemo(
    () => mapBreeds(petBreedsResponse),
    [petBreedsResponse]
  );

  // تحميل الداتا الخاصة بالفورم (types + breeds)
  const isLoadingData = isTypesLoading || isBreedsLoading;

  const handleCreatePet = async (dataFromForm) => {
    try {
      console.log("data from form:", dataFromForm);

      const payload = {
        ...dataFromForm,
        owner_id:
          dataFromForm.owner_id ??
          dataFromForm.ownerId ??
          1,
        // مهم عشان 422 تبع "description must be a string"
        description: dataFromForm.description ,
      };

      console.log("payload to API:", payload);

      await createPet(payload).unwrap();

      navigate("/dashboard/pet-management");
    } catch (error) {
      console.error("Failed to create pet:", error);
      // TODO: ممكن تضيف Toast هون لاحقاً
    }
  };

  // 🔹 حالة التحميل (قبل ما توصل الـ types و الـ breeds)
  if (isLoadingData) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardContent className="py-10">
            <p className="text-center text-gray-500">
              Loading form data...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* زر الرجوع */}
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

      {/* كرت عنوان الصفحة */}
      <Card className="shadow-sm border border-slate-100 bg-white/80">
        <CardHeader className="flex flex-col items-center gap-3 py-6">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 via-blue-500/5 to-blue-500/25 flex items-center justify-center border border-blue-100 shadow-sm">
              <PawPrint className="w-6 h-6 text-blue-600" />
            </div>
            <div className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-slate-900">
              Add New Pet
            </CardTitle>
            <p className="text-sm text-slate-500">
              Register a new pet in the system
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* كرت معلومات الحيوان */}
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
                Fill in the basic information about the pet
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <PetForm
            onSubmit={handleCreatePet}
            isSubmitting={isSubmitting}
            petTypes={petTypes}
            breeds={breeds}
            showAdoptionOption={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPetPage;
