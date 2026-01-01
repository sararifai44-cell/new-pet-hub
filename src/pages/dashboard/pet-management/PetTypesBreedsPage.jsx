// src/pages/dashboard/pet-management/PetTypesBreedsPage.jsx
import React, { useMemo, useState } from "react";

import ConfirmDeleteDialog from "../../../components/ui/confirm-delete-dialog";

import {
  useGetPetTypesQuery,
  useCreatePetTypeMutation,
  useDeletePetTypeMutation,
  useUpdatePetTypeMutation,
} from "../../../features/petType/petTypeApiSlice";

import {
  useCreatePetBreedMutation,
  useDeletePetBreedMutation,
  useUpdatePetBreedMutation,
} from "../../../features/petBreed/petBreedApiSlice";

import TypesPanel from "../../../features/pet/components/typesBreeds/TypesPanel";
import BreedsPanel from "../../../features/pet/components/typesBreeds/BreedsPanel";
import TypeBreedDialogs from "../../../features/pet/components/typesBreeds/TypeBreedDialogs";

import {
  mapTypesFromResponse,
  getBreedsCountForType,
  filterTypesList,
  filterBreedsList,
} from "../../../features/pet/components/typesBreeds/helpers";

const PetTypesBreedsPage = () => {
  const {
    data: petTypesResponse,
    isLoading: isTypesLoading,
    isError: isTypesError,
  } = useGetPetTypesQuery();

  const [createPetType, { isLoading: isCreatingType }] = useCreatePetTypeMutation();
  const [deletePetType, { isLoading: isDeletingType }] = useDeletePetTypeMutation();
  const [updatePetType, { isLoading: isUpdatingType }] = useUpdatePetTypeMutation();

  const [createPetBreed, { isLoading: isCreatingBreed }] = useCreatePetBreedMutation();
  const [deletePetBreed, { isLoading: isDeletingBreed }] = useDeletePetBreedMutation();
  const [updatePetBreed, { isLoading: isUpdatingBreed }] = useUpdatePetBreedMutation();

  const types = useMemo(() => mapTypesFromResponse(petTypesResponse), [petTypesResponse]);

  const [selectedTypeId, setSelectedTypeId] = useState(null);

  const selectedType = useMemo(() => {
    if (!types.length) return null;
    const found = types.find((t) => t.type_id === selectedTypeId);
    return found ?? types[0];
  }, [types, selectedTypeId]);

  const selectedTypeName = selectedType?.name_en || selectedType?.name || "-";

  const [typeSearch, setTypeSearch] = useState("");
  const [breedSearch, setBreedSearch] = useState("");

  // Dialog إضافة نوع
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [typeNameEn, setTypeNameEn] = useState("");
  const [typeNameAr, setTypeNameAr] = useState("");
  const [typeError, setTypeError] = useState("");

  // Dialog إضافة سلالة
  const [isBreedDialogOpen, setIsBreedDialogOpen] = useState(false);
  const [breedNameEn, setBreedNameEn] = useState("");
  const [breedNameAr, setBreedNameAr] = useState("");
  const [breedError, setBreedError] = useState("");

  // Delete dialog (type / breed)
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteMode, setDeleteMode] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isDeleting = isDeletingType || isDeletingBreed;

  // Edit type
  const [isEditTypeDialogOpen, setIsEditTypeDialogOpen] = useState(false);
  const [typeBeingEdited, setTypeBeingEdited] = useState(null);
  const [editTypeNameEn, setEditTypeNameEn] = useState("");
  const [editTypeNameAr, setEditTypeNameAr] = useState("");
  const [editTypeError, setEditTypeError] = useState("");

  // Edit breed
  const [isEditBreedDialogOpen, setIsEditBreedDialogOpen] = useState(false);
  const [breedBeingEdited, setBreedBeingEdited] = useState(null);
  const [editBreedNameEn, setEditBreedNameEn] = useState("");
  const [editBreedNameAr, setEditBreedNameAr] = useState("");
  const [editBreedError, setEditBreedError] = useState("");

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
    setDeleteMode(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !deleteMode) return;

    try {
      if (deleteMode === "type") {
        await deletePetType(deleteTarget.type_id).unwrap();

        if (selectedType?.type_id === deleteTarget.type_id) {
          const remaining = types.filter((t) => t.type_id !== deleteTarget.type_id);
          setSelectedTypeId(remaining[0]?.type_id ?? null);
        }
      } else if (deleteMode === "breed") {
        await deletePetBreed(deleteTarget.breed_id).unwrap();
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(error?.data?.message || "Failed to delete item. Please try again.");
    } finally {
      closeDeleteDialog();
    }
  };

  // ------- Types Handlers -------
  const handleOpenCreateType = () => {
    setTypeError("");
    setTypeNameEn("");
    setTypeNameAr("");
    setIsTypeDialogOpen(true);
  };

  const handleAddType = async () => {
    setTypeError("");
    const trimmedEn = typeNameEn.trim();
    const trimmedAr = typeNameAr.trim();

    if (!trimmedEn || !trimmedAr) {
      setTypeError("Both English and Arabic names are required.");
      return;
    }

    const exists = types.some((t) => {
      const existing = (t.name_en || t.name || "").toLowerCase();
      return existing === trimmedEn.toLowerCase();
    });

    if (exists) {
      setTypeError("This type already exists.");
      return;
    }

    try {
      const payload = { name_en: trimmedEn, name_ar: trimmedAr, name: trimmedEn };

      const result = await createPetType(payload).unwrap();
      const createdId = result?.type_id ?? result?.id ?? null;
      if (createdId) setSelectedTypeId(createdId);

      setTypeNameEn("");
      setTypeNameAr("");
      setIsTypeDialogOpen(false);
    } catch (error) {
      console.error(error);
      setTypeError(error?.data?.message || "Failed to create pet type. Please try again.");
    }
  };

  const handleDeleteType = (type) => {
    setDeleteMode("type");
    setDeleteTarget(type);
    setIsDeleteDialogOpen(true);
  };

  const openEditTypeDialog = (type) => {
    setTypeBeingEdited(type);
    setEditTypeNameEn(type.name_en || type.name || "");
    setEditTypeNameAr(type.name_ar || "");
    setEditTypeError("");
    setIsEditTypeDialogOpen(true);
  };

  const handleUpdateType = async () => {
    if (!typeBeingEdited) return;

    setEditTypeError("");
    const trimmedEn = editTypeNameEn.trim();
    const trimmedAr = editTypeNameAr.trim();

    if (!trimmedEn || !trimmedAr) {
      setEditTypeError("Both English and Arabic names are required.");
      return;
    }

    const exists = types.some((t) => {
      if (t.type_id === typeBeingEdited.type_id) return false;
      const existing = (t.name_en || t.name || "").toLowerCase();
      return existing === trimmedEn.toLowerCase();
    });

    if (exists) {
      setEditTypeError("This type already exists.");
      return;
    }

    try {
      const payload = {
        id: typeBeingEdited.type_id,
        name_en: trimmedEn,
        name_ar: trimmedAr,
        name: trimmedEn,
      };

      await updatePetType(payload).unwrap();

      setIsEditTypeDialogOpen(false);
      setTypeBeingEdited(null);
      setEditTypeNameEn("");
      setEditTypeNameAr("");
    } catch (error) {
      console.error("update type error:", error);
      setEditTypeError(error?.data?.message || "Failed to update pet type. Please try again.");
    }
  };

  // ------- Breeds Handlers -------
  const handleOpenCreateBreed = () => {
    setBreedError("");
    setBreedNameEn("");
    setBreedNameAr("");
    setIsBreedDialogOpen(true);
  };

  const handleAddBreed = async () => {
    setBreedError("");

    if (!selectedType) {
      setBreedError("Please select a pet type first.");
      return;
    }

    const trimmedEn = breedNameEn.trim();
    const trimmedAr = breedNameAr.trim();

    if (!trimmedEn || !trimmedAr) {
      setBreedError("Both English and Arabic names are required.");
      return;
    }

    const exists =
      selectedType.breeds?.some((b) => {
        const existing = (b.name_en || b.name || "").toLowerCase();
        return existing === trimmedEn.toLowerCase();
      }) ?? false;

    if (exists) {
      setBreedError("This breed already exists for this type.");
      return;
    }

    try {
      const payload = {
        pet_type_id: selectedType.type_id,
        name_en: trimmedEn,
        name_ar: trimmedAr,
        name: trimmedEn,
      };

      await createPetBreed(payload).unwrap();

      setBreedNameEn("");
      setBreedNameAr("");
      setIsBreedDialogOpen(false);
    } catch (error) {
      console.error("create breed error:", error);

      const apiMessage =
        error?.data?.message ||
        (error?.data?.errors && Object.values(error.data.errors || {})[0]?.[0]) ||
        null;

      setBreedError(apiMessage || "Failed to create breed. Please try again.");
    }
  };

  const handleDeleteBreed = (breed) => {
    setDeleteMode("breed");
    setDeleteTarget(breed);
    setIsDeleteDialogOpen(true);
  };

  const openEditBreedDialog = (breed) => {
    setBreedBeingEdited(breed);
    setEditBreedNameEn(breed.name_en || breed.name || "");
    setEditBreedNameAr(breed.name_ar || "");
    setEditBreedError("");
    setIsEditBreedDialogOpen(true);
  };

  const handleUpdateBreed = async () => {
    if (!breedBeingEdited || !selectedType) return;

    setEditBreedError("");
    const trimmedEn = editBreedNameEn.trim();
    const trimmedAr = editBreedNameAr.trim();

    if (!trimmedEn || !trimmedAr) {
      setEditBreedError("Both English and Arabic names are required.");
      return;
    }

    const exists =
      selectedType.breeds?.some((b) => {
        if (b.breed_id === breedBeingEdited.breed_id) return false;
        const existing = (b.name_en || b.name || "").toLowerCase();
        return existing === trimmedEn.toLowerCase();
      }) ?? false;

    if (exists) {
      setEditBreedError("This breed already exists for this type.");
      return;
    }

    try {
      const payload = {
        id: breedBeingEdited.breed_id,
        name_en: trimmedEn,
        name_ar: trimmedAr,
        name: trimmedEn,
      };

      await updatePetBreed(payload).unwrap();

      setIsEditBreedDialogOpen(false);
      setBreedBeingEdited(null);
      setEditBreedNameEn("");
      setEditBreedNameAr("");
    } catch (error) {
      console.error("update breed error:", error);

      const apiMessage =
        error?.data?.message ||
        (error?.data?.errors && Object.values(error.data.errors || {})[0]?.[0]) ||
        null;

      setEditBreedError(apiMessage || "Failed to update breed. Please try again.");
    }
  };

  const filteredTypes = useMemo(() => filterTypesList(types, typeSearch), [types, typeSearch]);
  const filteredBreeds = useMemo(
    () => filterBreedsList(selectedType, breedSearch),
    [selectedType, breedSearch]
  );

  if (isTypesLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <p className="text-gray-500">Loading pet types...</p>
      </div>
    );
  }

  if (isTypesError) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <p className="text-red-500">Failed to load pet types.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Types &amp; Breeds</h1>
        <p className="text-slate-500 text-sm">Organize pet categories and their detailed breeds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
        <TypesPanel
          filteredTypes={filteredTypes}
          types={types}
          selectedType={selectedType}
          onSelectTypeId={setSelectedTypeId}
          typeSearch={typeSearch}
          setTypeSearch={setTypeSearch}
          onOpenCreateType={handleOpenCreateType}
          onOpenEditType={openEditTypeDialog}
          onDeleteType={handleDeleteType}
          isCreatingType={isCreatingType}
          isDeletingType={isDeletingType}
          getBreedsCountForType={getBreedsCountForType}
        />

        <BreedsPanel
          selectedType={selectedType}
          selectedTypeName={selectedTypeName}
          filteredBreeds={filteredBreeds}
          breedSearch={breedSearch}
          setBreedSearch={setBreedSearch}
          onOpenCreateBreed={handleOpenCreateBreed}
          onOpenEditBreed={openEditBreedDialog}
          onDeleteBreed={handleDeleteBreed}
          isCreatingBreed={isCreatingBreed}
          isDeletingBreed={isDeletingBreed}
        />
      </div>

      <TypeBreedDialogs
        // Add Type
        isTypeDialogOpen={isTypeDialogOpen}
        setIsTypeDialogOpen={setIsTypeDialogOpen}
        typeNameEn={typeNameEn}
        setTypeNameEn={setTypeNameEn}
        typeNameAr={typeNameAr}
        setTypeNameAr={setTypeNameAr}
        typeError={typeError}
        setTypeError={setTypeError}
        isCreatingType={isCreatingType}
        handleAddType={handleAddType}
        // Edit Type
        isEditTypeDialogOpen={isEditTypeDialogOpen}
        setIsEditTypeDialogOpen={setIsEditTypeDialogOpen}
        setTypeBeingEdited={setTypeBeingEdited}
        editTypeNameEn={editTypeNameEn}
        setEditTypeNameEn={setEditTypeNameEn}
        editTypeNameAr={editTypeNameAr}
        setEditTypeNameAr={setEditTypeNameAr}
        editTypeError={editTypeError}
        setEditTypeError={setEditTypeError}
        isUpdatingType={isUpdatingType}
        handleUpdateType={handleUpdateType}
        // Add Breed
        isBreedDialogOpen={isBreedDialogOpen}
        setIsBreedDialogOpen={setIsBreedDialogOpen}
        breedNameEn={breedNameEn}
        setBreedNameEn={setBreedNameEn}
        breedNameAr={breedNameAr}
        setBreedNameAr={setBreedNameAr}
        breedError={breedError}
        setBreedError={setBreedError}
        selectedTypeName={selectedTypeName}
        isCreatingBreed={isCreatingBreed}
        handleAddBreed={handleAddBreed}
        // Edit Breed
        isEditBreedDialogOpen={isEditBreedDialogOpen}
        setIsEditBreedDialogOpen={setIsEditBreedDialogOpen}
        setBreedBeingEdited={setBreedBeingEdited}
        editBreedNameEn={editBreedNameEn}
        setEditBreedNameEn={setEditBreedNameEn}
        editBreedNameAr={editBreedNameAr}
        setEditBreedNameAr={setEditBreedNameAr}
        editBreedError={editBreedError}
        setEditBreedError={setEditBreedError}
        isUpdatingBreed={isUpdatingBreed}
        handleUpdateBreed={handleUpdateBreed}
      />

      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isDeleting) closeDeleteDialog();
          else setIsDeleteDialogOpen(open);
        }}
        entityLabel={deleteMode === "type" ? "type" : "breed"}
        name={deleteTarget?.name_en || deleteTarget?.name || deleteTarget?.name_ar}
        description={
          deleteMode === "type"
            ? "This action cannot be undone. This will permanently delete the type and all breeds under it."
            : "This action cannot be undone. This will permanently delete the breed from the system."
        }
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default PetTypesBreedsPage;
