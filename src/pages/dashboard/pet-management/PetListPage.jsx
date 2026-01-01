// src/pages/dashboard/pet-management/PetListPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, PawPrint, Heart, XCircle, Layers } from "lucide-react";
import { toast } from "sonner";

import PetFilters from "../../../features/pet/components/PetFilters";
import PetTable from "../../../features/pet/components/PetTable";

import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import ConfirmDeleteDialog from "../../../components/ui/confirm-delete-dialog";

import { useGetPetsQuery, useDeletePetMutation } from "../../../features/pet/petApiSlice";
import { useGetPetTypesQuery } from "../../../features/petType/petTypeApiSlice";

// fallback paging
const PAGE_SIZE_FALLBACK = 15;

// filter defaults
const INITIAL_FILTERS = {
  search: "",
  type: "",
  breed: "",
  status: "",
  gender: "",
};

// normalize text
const normalize = (v) => String(v ?? "").trim().toLowerCase();

export default function PetListPage() {
  const navigate = useNavigate();

  // ui state
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  // fetch pets
  const {
    data: petsRes,
    isLoading: isPetsLoading,
    isError: isPetsError,
    isFetching,
    refetch,
  } = useGetPetsQuery({ page: currentPage }, { refetchOnMountOrArgChange: true });

  // fetch types
  const { data: typesRes } = useGetPetTypesQuery();

  // delete mutation
  const [deletePet, { isLoading: isDeleting }] = useDeletePetMutation();

  // delete dialog
  const [petToDelete, setPetToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // pets list
  const pets = useMemo(() => {
    const list = petsRes?.data ?? [];
    return Array.isArray(list) ? list : [];
  }, [petsRes]);

  // pagination meta
  const meta = petsRes?.meta ?? petsRes ?? {};
  const perPage = Number(meta?.per_page ?? PAGE_SIZE_FALLBACK);
  const total = Number(meta?.total ?? pets.length);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  // clamp page
  useEffect(() => {
    if (currentPage !== safePage) setCurrentPage(safePage);
  }, [totalPages]);

  // map options
  const { petTypes, breeds } = useMemo(() => {
    const raw = typesRes?.data ?? [];
    const typesArr = Array.isArray(raw) ? raw : [];

    const petTypes = typesArr.map((t) => ({ type_id: t.id, name: t.name }));
    const breeds = typesArr.flatMap((t) =>
      (t.breeds || []).map((b) => ({
        breed_id: b.id,
        name: b.name,
        type_id: t.id,
      }))
    );

    return { petTypes, breeds };
  }, [typesRes]);

  // apply filters
  const filteredPets = useMemo(() => {
    const s = normalize(filters.search);
    const typeId = filters.type ? Number(filters.type) : null;
    const breedId = filters.breed ? Number(filters.breed) : null;
    const gender = normalize(filters.gender);
    const status = filters.status;

    return pets.filter((pet) => {
      const petName = normalize(pet?.name);
      const typeName = normalize(pet?.pet_type?.name);
      const breedName = normalize(pet?.pet_breed?.name);
      const ownerName = normalize(pet?.owner?.full_name || pet?.owner?.name);

      const matchesSearch =
        !s ||
        petName.includes(s) ||
        typeName.includes(s) ||
        breedName.includes(s) ||
        ownerName.includes(s);

      const matchesType = !typeId || Number(pet?.pet_type?.id) === typeId;
      const matchesBreed = !breedId || Number(pet?.pet_breed?.id) === breedId;

      const petGender = normalize(pet?.gender);
      const matchesGender = !gender || petGender === gender;

      const matchesStatus =
        !status ||
        (status === "available" && !!pet?.is_adoptable) ||
        (status === "not-available" && !pet?.is_adoptable);

      return matchesSearch && matchesType && matchesBreed && matchesGender && matchesStatus;
    });
  }, [pets, filters]);

  // stats cards
  const totalPets = total;
  const availablePets = useMemo(
    () => (petsRes?.data ?? []).filter((p) => !!p?.is_adoptable).length,
    [petsRes]
  );
  const notAvailablePets = Math.max(0, (petsRes?.data ?? []).length - availablePets);
  const petTypesCount = petTypes.length;

  // change filters
  const onFilterChange = (next) => {
    setFilters(next);
    setCurrentPage(1);
  };

  // reset filters
  const onReset = () => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  // navigate actions
  const onView = (pet) => navigate(`/dashboard/pet-management/${pet.id}`);
  const onEdit = (pet) => navigate(`/dashboard/pet-management/edit/${pet.id}`);
  const onApplications = (pet) => navigate(`/dashboard/pet-management/${pet.id}/applications`);

  // open delete
  const onDelete = (pet) => {
    setPetToDelete(pet);
    setIsDeleteDialogOpen(true);
  };

  // confirm delete
  const confirmDelete = async () => {
    if (!petToDelete?.id) return;

    try {
      await deletePet(petToDelete.id).unwrap();
      toast.success("Pet deleted successfully.");
    } catch (e) {
      console.error(e);
      toast.error("Delete failed.");
    } finally {
      setIsDeleteDialogOpen(false);
      setPetToDelete(null);
    }
  };

  // page navigation
  const goToPage = (page) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(clamped);
  };

  // loading state
  if (isPetsLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">Loading pets...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // error state
  if (isPetsError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-destructive">Failed to load pets.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* page header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 via-blue-500/5 to-blue-500/25 flex items-center justify-center border border-blue-100 shadow-sm">
            <PawPrint className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Pet Management</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage all pets in the system and their adoption status
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching} className="text-xs">
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>

          <Button onClick={() => navigate("/dashboard/pet-management/add")} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Pet
          </Button>
        </div>
      </div>

      {/* quick stats */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-violet-200 bg-violet-50 flex items-center justify-center">
                <PawPrint className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Total Pets</p>
                <p className="text-lg font-semibold text-slate-900">{totalPets}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-emerald-200 bg-emerald-50 flex items-center justify-center">
                <Heart className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Available</p>
                <p className="text-lg font-semibold text-slate-900">{availablePets}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-amber-200 bg-amber-50 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Not Available</p>
                <p className="text-lg font-semibold text-slate-900">{notAvailablePets}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-blue-200 bg-blue-50 flex items-center justify-center">
                <Layers className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Pet Types</p>
                <p className="text-lg font-semibold text-slate-900">{petTypesCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* filter controls */}
      <PetFilters
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onReset}
        petTypes={petTypes}
        breeds={breeds}
      />

      {/* pets table */}
      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900">All Pets</CardTitle>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Page {safePage} of {totalPages}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <PetTable
            pets={filteredPets}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onApplications={onApplications}
            showActions
          />

          {/* page controls */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-4">
            <div className="text-sm text-gray-500">
              Page {safePage} of {totalPages} • Total {total}
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Button variant="outline" size="sm" disabled={safePage === 1} onClick={() => goToPage(safePage - 1)}>
                &lt; Previous
              </Button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNumber = idx + 1;
                const isActive = pageNumber === safePage;
                return (
                  <Button
                    key={pageNumber}
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    onClick={() => goToPage(pageNumber)}
                    className={"w-9 h-9 px-0 text-sm " + (isActive ? "" : "bg-white")}
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                disabled={safePage === totalPages}
                onClick={() => goToPage(safePage + 1)}
              >
                Next &gt;
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* delete confirm */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open && isDeleting) return;
          setIsDeleteDialogOpen(open);
          if (!open) setPetToDelete(null);
        }}
        entityLabel="pet"
        name={petToDelete?.name}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        actionVerb="Delete"
        confirmText="Delete"
        loadingText="Deleting..."
        confirmVariant="destructive"
        cancelText="Cancel"
      />
    </div>
  );
}
