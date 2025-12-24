// src/pages/dashboard/pet-management/PetListPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

import PetTable from "../../../features/pet/components/PetTable";
import {
  useGetPetsQuery,
  useDeletePetMutation,
} from "../../../features/pet/petApiSlice";

export default function PetListPage() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetPetsQuery();
  const [deletePet, { isLoading: isDeleting }] = useDeletePetMutation();

  const pets = data?.data ?? [];

  // ✅ مطابق ل App.jsx
  const onView = (pet) => navigate(`/dashboard/pet-management/${pet.id}`);
  const onEdit = (pet) => navigate(`/dashboard/pet-management/edit/${pet.id}`);

  const onDelete = async (pet) => {
    if (!pet?.id) return;
    const ok = window.confirm(`Delete "${pet.name}" ?`);
    if (!ok) return;

    try {
      await deletePet(pet.id).unwrap();
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pets</CardTitle>

          {/* ✅ /dashboard/pet-management/add */}
          <Button type="button" onClick={() => navigate("/dashboard/pet-management/add")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Pet
          </Button>
        </CardHeader>

        <CardContent>
          {isLoading && <div className="text-sm text-gray-500">Loading...</div>}
          {isError && <div className="text-sm text-red-600">Failed to load pets</div>}

          {!isLoading && !isError && (
            <PetTable
              pets={pets}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              showActions
            />
          )}

          {isDeleting && <div className="mt-3 text-xs text-gray-500">Deleting...</div>}
        </CardContent>
      </Card>
    </div>
  );
}
