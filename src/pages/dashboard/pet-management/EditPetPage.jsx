// src/pages/dashboard/pet-management/EditPetPage.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

import PetForm from "../../../features/pet/components/PetForm";
import { useGetPetQuery, useUpdatePetMutation } from "../../../features/pet/petApiSlice";
import { useGetPetTypesQuery } from "../../../features/petType/petTypeApiSlice";
import { useGetPetBreedsQuery } from "../../../features/petBreed/petBreedApiSlice";

export default function EditPetPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const petId = Number(id);

  const { data: petRes, isLoading: loadingPet, isError } = useGetPetQuery(petId);
  const pet = petRes?.data ?? null;

  const { data: typesRes } = useGetPetTypesQuery();
  const { data: breedsRes } = useGetPetBreedsQuery();

  const petTypes = typesRes?.data ?? [];
  const breeds = breedsRes?.data ?? [];

  const [updatePet, { isLoading: isSubmitting }] = useUpdatePetMutation();

  const handleSubmit = async (formData) => {
    try {
      await updatePet({ id: petId, formData }).unwrap();
      navigate(`/dashboard/pet-management/pets/${petId}`);
    } catch (e) {
      console.error(e);
      alert("Update failed");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Pet</CardTitle>
      </CardHeader>

      <CardContent>
        {loadingPet && <div className="text-sm text-gray-500">Loading...</div>}
        {isError && <div className="text-sm text-red-600">Failed to load pet</div>}

        {!loadingPet && pet && (
          <PetForm
            initialData={pet}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            petTypes={petTypes}
            breeds={breeds}
            showAdoptionOption
          />
        )}
      </CardContent>
    </Card>
  );
}
