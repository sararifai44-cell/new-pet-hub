// src/pages/dashboard/pet-management/AddPetPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

import PetForm from "../../../features/pet/components/PetForm";
import { useCreatePetMutation } from "../../../features/pet/petApiSlice";
import { useGetPetTypesQuery } from "../../../features/petType/petTypeApiSlice";
import { useGetPetBreedsQuery } from "../../../features/petBreed/petBreedApiSlice";

export default function AddPetPage() {
  const navigate = useNavigate();

  const { data: typesRes, isLoading: loadingTypes } = useGetPetTypesQuery();
  const { data: breedsRes, isLoading: loadingBreeds } = useGetPetBreedsQuery();

  const petTypes = typesRes?.data ?? [];
  const breeds = breedsRes?.data ?? [];

  const [createPet, { isLoading: isSubmitting }] = useCreatePetMutation();

  const handleSubmit = async (formData) => {
    try {
      await createPet(formData).unwrap();
      navigate("/dashboard/pet-management/pets");
    } catch (e) {
      console.error(e);
      alert("Create failed");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Pet</CardTitle>
      </CardHeader>
      <CardContent>
        {(loadingTypes || loadingBreeds) && (
          <div className="text-sm text-gray-500 mb-4">Loading types/breeds...</div>
        )}

        <PetForm
          initialData={null}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          petTypes={petTypes}
          breeds={breeds}
          showAdoptionOption
        />
      </CardContent>
    </Card>
  );
}
