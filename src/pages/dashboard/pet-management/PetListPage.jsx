// src/pages/dashboard/pet-management/PetListPage.jsx

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  PawPrint,
  Heart,
  XCircle,
  Layers,
} from "lucide-react";

import PetFilters from "../../../features/pet/components/PetFilters";
import PetTable from "../../../features/pet/components/PetTable";

import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import ConfirmDeleteDialog from "../../../components/ui/confirm-delete-dialog";

import {
  useGetPetsQuery,
  useDeletePetMutation,
} from "../../../features/pet/petApiSlice";
import { useGetPetTypesQuery } from "../../../features/petType/petTypeApiSlice";

// ---------- ثوابت + دوال مساعدة خارج الكومبوننت ----------

const PAGE_SIZE = 8;

const INITIAL_FILTERS = {
  search: "",
  type: "",
  breed: "",
  status: "",
  gender: "",
};

const mapPetsResponse = (petsResponse) => {
  if (!petsResponse) return [];

  const raw = petsResponse.data ?? petsResponse;

  return raw.map((pet) => ({
    pet_id: pet.id,
    name: pet.name,
    gender: pet.gender,
    date_of_birth: pet.date_of_birth,
    description: pet.description,
    is_adoptable: pet.is_adoptable,
    // مؤقتاً: نخلي is_adopted عكس is_adoptable
    is_adopted: !pet.is_adoptable,
    breed:
      pet.pet_breed && pet.pet_type
        ? {
            breed_id: pet.pet_breed.id,
            name: pet.pet_breed.name,
            type: {
              type_id: pet.pet_type.id,
              name: pet.pet_type.name,
            },
          }
        : pet.pet_breed
        ? {
            breed_id: pet.pet_breed.id,
            name: pet.pet_breed.name,
          }
        : undefined,
    owner: null,
  }));
};

const mapPetTypesResponse = (petTypesResponse) => {
  if (!petTypesResponse) return { petTypes: [], breeds: [] };

  const raw = petTypesResponse.data ?? petTypesResponse;

  const petTypes = raw.map((t) => ({
    type_id: t.id,
    name: t.name,
  }));

  const breeds = raw.flatMap((t) =>
    (t.breeds || []).map((b) => ({
      breed_id: b.id,
      name: b.name,
      type_id: t.id,
    }))
  );

  return { petTypes, breeds };
};

const filterPets = (pets, filters) => {
  const { search, type, breed, status, gender } = filters;

  const normalizedSearch = search.trim().toLowerCase();
  const hasSearch = Boolean(normalizedSearch);
  const typeId = type ? Number(type) : null;
  const breedId = breed ? Number(breed) : null;
  const normalizedGender = gender?.toLowerCase();

  return pets.filter((pet) => {
    const matchesSearch =
      !hasSearch ||
      pet.name.toLowerCase().includes(normalizedSearch) ||
      pet.breed?.name.toLowerCase().includes(normalizedSearch) ||
      pet.owner?.full_name?.toLowerCase().includes(normalizedSearch);

    const matchesType =
      !typeId || pet.breed?.type?.type_id === typeId;

    const matchesBreed =
      !breedId || pet.breed?.breed_id === breedId;

    const matchesStatus =
      !status ||
      (status === "available" && pet.is_adoptable) ||
      (status === "not-available" && !pet.is_adoptable);

    const matchesGender =
      !normalizedGender ||
      pet.gender?.toLowerCase() === normalizedGender;

    return (
      matchesSearch &&
      matchesType &&
      matchesBreed &&
      matchesStatus &&
      matchesGender
    );
  });
};

const paginate = (items, page, pageSize) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return items.slice(start, end);
};

// ---------- الكومبوننت الرئيسي ----------

export default function PetListPage() {
  const navigate = useNavigate();

  // Filters
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // RTK Query
  const {
    data: petsResponse,
    isLoading: isPetsLoading,
    isError: isPetsError,
  } = useGetPetsQuery();

  const { data: petTypesResponse } = useGetPetTypesQuery();

  const [deletePet, { isLoading: isDeletingPet }] =
    useDeletePetMutation();

  // Normalize pets data
  const pets = useMemo(
    () => mapPetsResponse(petsResponse),
    [petsResponse]
  );

  // Pet types + breeds
  const { petTypes, breeds } = useMemo(
    () => mapPetTypesResponse(petTypesResponse),
    [petTypesResponse]
  );

  // Stats
  const totalPets = pets.length;
  const availablePets = pets.filter(
    (pet) => pet.is_adoptable
  ).length;
  const notAvailablePets = totalPets - availablePets;

  // عدد الأنواع الموجودة
  const petTypesCount = petTypes.length;

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPets = useMemo(
    () => filterPets(pets, filters),
    [pets, filters]
  );

  const totalPages =
    filteredPets.length === 0
      ? 1
      : Math.ceil(filteredPets.length / PAGE_SIZE);

  const paginatedPets = useMemo(() => {
    const safePage = Math.min(
      Math.max(currentPage, 1),
      totalPages
    );
    return paginate(filteredPets, safePage, PAGE_SIZE);
  }, [filteredPets, currentPage, totalPages]);

  // Delete dialog
  const [petToDelete, setPetToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    useState(false);

  const openDeleteDialog = (pet) => {
    setPetToDelete(pet);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (isDeletingPet) return;
    setIsDeleteDialogOpen(false);
    setPetToDelete(null);
  };

  const confirmDeletePet = async () => {
    if (!petToDelete) return;

    try {
      await deletePet(petToDelete.pet_id).unwrap();
    } catch (error) {
      console.error("Failed to delete pet:", error);
      alert(
        error?.data?.message ||
          "Failed to delete pet. Please try again."
      );
    } finally {
      setIsDeleteDialogOpen(false);
      setPetToDelete(null);
    }
  };

  // Handlers
  const handleViewPet = (pet) => {
    navigate(`/dashboard/pet-management/${pet.pet_id}`);
  };

  const handleEditPet = (pet) => {
    navigate(`/dashboard/pet-management/edit/${pet.pet_id}`);
  };

  const handleDeletePet = (pet) => {
    openDeleteDialog(pet);
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  const handleFilterChange = (updaterOrValue) => {
    setFilters((prev) =>
      typeof updaterOrValue === "function"
        ? updaterOrValue(prev)
        : updaterOrValue
    );
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(clamped);
  };

  // Loading / Error states
  if (isPetsLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">
              Loading pets...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isPetsError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-destructive">
              Failed to load pets.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 via-blue-500/5 to-blue-500/25 flex items-center justify-center border border-blue-100 shadow-sm">
            <PawPrint className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Pet Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage all pets in the system and their adoption status
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() =>
              navigate("/dashboard/pet-management/add")
            }
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Pet
          </Button>
        </div>
      </div>

      {/* 🔹 Compact stats bar (نفس نمط المتجر) */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total pets */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-violet-200 bg-violet-50 flex items-center justify-center">
                <PawPrint className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Total Pets
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {totalPets}
                </p>
              </div>
            </div>

            {/* Available for adoption */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-emerald-200 bg-emerald-50 flex items-center justify-center">
                <Heart className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Available
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {availablePets}
                </p>
              </div>
            </div>

            {/* Not available */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-amber-200 bg-amber-50 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Not Available
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {notAvailablePets}
                </p>
              </div>
            </div>

            {/* Pet types count */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-blue-200 bg-blue-50 flex items-center justify-center">
                <Layers className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Pet Types
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {petTypesCount}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <PetFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        petTypes={petTypes}
        breeds={breeds}
      />

      {/* Table + Pagination */}
      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900">
              All Pets
            </CardTitle>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {filteredPets.length} pets
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <PetTable
            pets={paginatedPets}
            onView={handleViewPet}
            onEdit={handleEditPet}
            onDelete={handleDeletePet}
          />

          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-4">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                className="flex items-center gap-1"
              >
                &lt; Previous
              </Button>

              {Array.from({ length: totalPages }).map(
                (_, idx) => {
                  const pageNumber = idx + 1;
                  const isActive = pageNumber === currentPage;
                  return (
                    <Button
                      key={pageNumber}
                      size="sm"
                      variant={isActive ? "default" : "outline"}
                      onClick={() => goToPage(pageNumber)}
                      className={
                        "w-9 h-9 px-0 text-sm " +
                        (isActive
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-white text-gray-700 hover:bg-gray-50")
                      }
                    >
                      {pageNumber}
                    </Button>
                  );
                }
              )}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
                className="flex items-center gap-1"
              >
                Next &gt;
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete dialog */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isDeletingPet) {
            closeDeleteDialog();
          } else {
            setIsDeleteDialogOpen(open);
          }
        }}
        entityLabel="pet"
        name={petToDelete?.name}
        isLoading={isDeletingPet}
        onConfirm={confirmDeletePet}
      />
    </div>
  );
}
