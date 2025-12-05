// src/pages/dashboard/pet-management/PetTypesBreedsPage.jsx

import React, { useState, useMemo } from "react";
import {
  PawPrint,
  Trash2,
  Plus,
  CheckCircle2,
  Pencil,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";

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

// ---------- Helpers خارج الكومبوننت ----------

const mapTypesFromResponse = (petTypesResponse) => {
  if (!petTypesResponse) return [];

  const raw = petTypesResponse.data ?? petTypesResponse;

  return raw.map((t) => ({
    type_id: t.id,
    name: t.name,
    breeds: (t.breeds || []).map((b) => ({
      breed_id: b.id,
      name: b.name,
    })),
  }));
};

const getBreedsCountForType = (types, typeId) => {
  const type = types.find((t) => t.type_id === typeId);
  return type?.breeds?.length ?? 0;
};

const filterTypesList = (types, search) => {
  const q = search.trim().toLowerCase();
  if (!q) return types;
  return types.filter((t) =>
    t.name.toLowerCase().includes(q)
  );
};

const filterBreedsList = (selectedType, search) => {
  if (!selectedType) return [];
  const q = search.trim().toLowerCase();
  const list = selectedType.breeds || [];
  if (!q) return list;
  return list.filter((b) =>
    b.name.toLowerCase().includes(q)
  );
};

// ---------- الكومبوننت الرئيسي ----------

const PetTypesBreedsPage = () => {
  const {
    data: petTypesResponse,
    isLoading: isTypesLoading,
    isError: isTypesError,
  } = useGetPetTypesQuery();

  const [createPetType, { isLoading: isCreatingType }] =
    useCreatePetTypeMutation();
  const [deletePetType, { isLoading: isDeletingType }] =
    useDeletePetTypeMutation();
  const [updatePetType, { isLoading: isUpdatingType }] =
    useUpdatePetTypeMutation();

  const [createPetBreed, { isLoading: isCreatingBreed }] =
    useCreatePetBreedMutation();
  const [deletePetBreed, { isLoading: isDeletingBreed }] =
    useDeletePetBreedMutation();
  const [updatePetBreed, { isLoading: isUpdatingBreed }] =
    useUpdatePetBreedMutation();

  const types = useMemo(
    () => mapTypesFromResponse(petTypesResponse),
    [petTypesResponse]
  );

  const [selectedTypeId, setSelectedTypeId] = useState(null);

  const selectedType = useMemo(() => {
    if (!types.length) return null;
    const found = types.find(
      (t) => t.type_id === selectedTypeId
    );
    return found ?? types[0];
  }, [types, selectedTypeId]);

  const [typeSearch, setTypeSearch] = useState("");
  const [breedSearch, setBreedSearch] = useState("");

  // Dialog إضافة نوع
  const [isTypeDialogOpen, setIsTypeDialogOpen] =
    useState(false);
  const [typeName, setTypeName] = useState("");
  const [typeError, setTypeError] = useState("");

  // Dialog إضافة سلالة
  const [isBreedDialogOpen, setIsBreedDialogOpen] =
    useState(false);
  const [breedName, setBreedName] = useState("");
  const [breedError, setBreedError] = useState("");

  // Delete dialog (type / breed)
  const [deleteTarget, setDeleteTarget] = useState(null); // type or breed
  const [deleteMode, setDeleteMode] = useState(null); // "type" | "breed"
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    useState(false);

  const isDeleting = isDeletingType || isDeletingBreed;

  // ---------- Edit dialogs state ----------

  // Edit type
  const [isEditTypeDialogOpen, setIsEditTypeDialogOpen] =
    useState(false);
  const [typeBeingEdited, setTypeBeingEdited] =
    useState(null);
  const [editTypeName, setEditTypeName] = useState("");
  const [editTypeError, setEditTypeError] = useState("");

  // Edit breed
  const [isEditBreedDialogOpen, setIsEditBreedDialogOpen] =
    useState(false);
  const [breedBeingEdited, setBreedBeingEdited] =
    useState(null);
  const [editBreedName, setEditBreedName] = useState("");
  const [editBreedError, setEditBreedError] =
    useState("");

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
          const remaining = types.filter(
            (t) => t.type_id !== deleteTarget.type_id
          );
          setSelectedTypeId(remaining[0]?.type_id ?? null);
        }
      } else if (deleteMode === "breed") {
        await deletePetBreed(deleteTarget.breed_id).unwrap();
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert(
        error?.data?.message ||
          "Failed to delete item. Please try again."
      );
    } finally {
      closeDeleteDialog();
    }
  };

  // ------- Types Handlers -------

  const handleAddType = async () => {
    setTypeError("");
    const trimmed = typeName.trim();

    if (!trimmed) {
      setTypeError("Type name is required.");
      return;
    }

    const exists = types.some(
      (t) =>
        t.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      setTypeError("This type already exists.");
      return;
    }

    try {
      const result = await createPetType({
        name: trimmed,
      }).unwrap();

      const createdId = result.type_id ?? result.id ?? null;
      if (createdId) {
        setSelectedTypeId(createdId);
      }

      setTypeName("");
      setIsTypeDialogOpen(false);
    } catch (error) {
      console.error(error);
      setTypeError(
        error?.data?.message ||
          "Failed to create pet type. Please try again."
      );
    }
  };

  const handleDeleteType = (type) => {
    const hasBreeds = (type.breeds || []).length > 0;
    if (hasBreeds) {
      alert(
        "You cannot delete a type that has breeds linked to it."
      );
      return;
    }

    setDeleteMode("type");
    setDeleteTarget(type);
    setIsDeleteDialogOpen(true);
  };

  const openEditTypeDialog = (type) => {
    setTypeBeingEdited(type);
    setEditTypeName(type.name);
    setEditTypeError("");
    setIsEditTypeDialogOpen(true);
  };

  const handleUpdateType = async () => {
    if (!typeBeingEdited) return;

    setEditTypeError("");
    const trimmed = editTypeName.trim();

    if (!trimmed) {
      setEditTypeError("Type name is required.");
      return;
    }

    const exists = types.some(
      (t) =>
        t.type_id !== typeBeingEdited.type_id &&
        t.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      setEditTypeError("This type already exists.");
      return;
    }

    try {
      const payload = {
        id: typeBeingEdited.type_id,
        name: trimmed,
      };

      await updatePetType(payload).unwrap();

      setIsEditTypeDialogOpen(false);
      setTypeBeingEdited(null);
      setEditTypeName("");
    } catch (error) {
      console.error("update type error:", error);
      setEditTypeError(
        error?.data?.message ||
          "Failed to update pet type. Please try again."
      );
    }
  };

  // ------- Breeds Handlers -------

  const handleAddBreed = async () => {
    setBreedError("");

    if (!selectedType) {
      setBreedError("Please select a pet type first.");
      return;
    }

    const trimmed = breedName.trim();
    if (!trimmed) {
      setBreedError("Breed name is required.");
      return;
    }

    const exists =
      selectedType.breeds?.some(
        (b) =>
          b.name.toLowerCase() === trimmed.toLowerCase()
      ) ?? false;
    if (exists) {
      setBreedError(
        "This breed already exists for this type."
      );
      return;
    }

    try {
      const payload = {
        pet_type_id: selectedType.type_id,
        name: trimmed,
        name_en: trimmed,
        name_ar: trimmed,
      };

      await createPetBreed(payload).unwrap();

      setBreedName("");
      setIsBreedDialogOpen(false);
    } catch (error) {
      console.error("create breed error:", error);

      const apiMessage =
        error?.data?.message ||
        (error?.data?.errors &&
          Object.values(error.data.errors || {})[0]?.[0]) ||
        null;

      setBreedError(
        apiMessage ||
          "Failed to create breed. Please try again."
      );
    }
  };

  const handleDeleteBreed = (breed) => {
    setDeleteMode("breed");
    setDeleteTarget(breed);
    setIsDeleteDialogOpen(true);
  };

  const openEditBreedDialog = (breed) => {
    setBreedBeingEdited(breed);
    setEditBreedName(breed.name);
    setEditBreedError("");
    setIsEditBreedDialogOpen(true);
  };

  const handleUpdateBreed = async () => {
    if (!breedBeingEdited || !selectedType) return;

    setEditBreedError("");
    const trimmed = editBreedName.trim();

    if (!trimmed) {
      setEditBreedError("Breed name is required.");
      return;
    }

    const exists =
      selectedType.breeds?.some(
        (b) =>
          b.breed_id !== breedBeingEdited.breed_id &&
          b.name.toLowerCase() === trimmed.toLowerCase()
      ) ?? false;

    if (exists) {
      setEditBreedError(
        "This breed already exists for this type."
      );
      return;
    }

    try {
      const payload = {
        id: breedBeingEdited.breed_id,
        name: trimmed,
        name_en: trimmed,
        name_ar: trimmed,
      };

      await updatePetBreed(payload).unwrap();

      setIsEditBreedDialogOpen(false);
      setBreedBeingEdited(null);
      setEditBreedName("");
    } catch (error) {
      console.error("update breed error:", error);

      const apiMessage =
        error?.data?.message ||
        (error?.data?.errors &&
          Object.values(error.data.errors || {})[0]?.[0]) ||
        null;

      setEditBreedError(
        apiMessage ||
          "Failed to update breed. Please try again."
      );
    }
  };

  // فلترة بالـ memo
  const filteredTypes = useMemo(
    () => filterTypesList(types, typeSearch),
    [types, typeSearch]
  );

  const filteredBreeds = useMemo(
    () => filterBreedsList(selectedType, breedSearch),
    [selectedType, breedSearch]
  );

  // حالات تحميل/خطأ للـ types
  if (isTypesLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">
          Loading pet types...
        </p>
      </div>
    );
  }

  if (isTypesError) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          Failed to load pet types.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Types &amp; Breeds Management
        </h1>
        <p className="text-gray-600 text-lg">
          Manage pet types and their breeds.
        </p>
      </div>

      {/* Layout: Left types / Right breeds */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
        {/* ========== LEFT: TYPES ========== */}
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-semibold">
                Pet Types
              </CardTitle>
              <p className="text-xs text-gray-500">
                Select a category
              </p>
            </div>

            {/* Dialog Add Type */}
            <Dialog
              open={isTypeDialogOpen}
              onOpenChange={setIsTypeDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={isCreatingType}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    Add New Pet Type
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                  <Label htmlFor="type-name">
                    Type Name
                  </Label>
                  <Input
                    id="type-name"
                    value={typeName}
                    onChange={(e) =>
                      setTypeName(e.target.value)
                    }
                    placeholder="e.g. Dog, Cat, Bird..."
                    className={
                      typeError
                        ? "border-red-300 bg-red-50"
                        : ""
                    }
                  />
                  {typeError && (
                    <p className="text-xs text-red-500">
                      {typeError}
                    </p>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    onClick={handleAddType}
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={isCreatingType}
                  >
                    {isCreatingType
                      ? "Saving..."
                      : "Confirm"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsTypeDialogOpen(false);
                      setTypeError("");
                      setTypeName("");
                    }}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Search types */}
            <div className="space-y-1">
              <Label>Search Types</Label>
              <Input
                placeholder="Search..."
                value={typeSearch}
                onChange={(e) =>
                  setTypeSearch(e.target.value)
                }
              />
            </div>

            {/* Types list */}
            <div className="space-y-3 max-h-[480px] overflow-auto pr-1">
              {filteredTypes.length === 0 && (
                <p className="text-sm text-gray-500">
                  No types found.
                </p>
              )}

              {filteredTypes.map((type) => {
                const isSelected =
                  selectedType &&
                  type.type_id ===
                    selectedType.type_id;
                const count = getBreedsCountForType(
                  types,
                  type.type_id
                );

                return (
                  <div
                    key={type.type_id}
                    onClick={() =>
                      setSelectedTypeId(type.type_id)
                    }
                    className={[
                      "flex items-center justify-between rounded-2xl border p-3 cursor-pointer transition shadow-sm",
                      isSelected
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-indigo-50 text-indigo-700 p-2 flex items-center justify-center">
                        <PawPrint className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {type.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {count} breeds
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                      )}

                      {/* Edit type */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditTypeDialog(type);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      {/* Delete type */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isDeletingType) {
                            handleDeleteType(type);
                          }
                        }}
                        disabled={isDeletingType}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ========== RIGHT: BREEDS ========== */}
        <div className="space-y-4">
          {!selectedType ? (
            <Card className="h-full flex items-center justify-center">
              <CardContent>
                <p className="text-gray-500">
                  Select a pet type on the left to view its
                  breeds.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Header bar for breeds */}
              <Dialog
                open={isBreedDialogOpen}
                onOpenChange={setIsBreedDialogOpen}
              >
                <div className="rounded-2xl bg-white border border-gray-200 text-gray-900 p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-indigo-50 text-indigo-700 p-3 flex items-center justify-center">
                      <PawPrint className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <h2 className="text-xl font-semibold">
                        {selectedType.name} Breeds
                      </h2>
                      <p className="text-xs md:text-sm text-gray-500">
                        {filteredBreeds.length} breeds
                        available
                      </p>
                    </div>
                  </div>

                  <DialogTrigger asChild>
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 self-start md:self-auto"
                      disabled={isCreatingBreed}
                    >
                      <Plus className="w-4 h-4" />
                      Add Breed
                    </Button>
                  </DialogTrigger>
                </div>

                {/* Dialog Add Breed */}
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      Add Breed to{" "}
                      <span className="text-indigo-600">
                        {selectedType.name}
                      </span>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-3">
                    <Label htmlFor="breed-name">
                      Breed Name
                    </Label>
                    <Input
                      id="breed-name"
                      value={breedName}
                      onChange={(e) =>
                        setBreedName(e.target.value)
                      }
                      placeholder="e.g. Golden Retriever, Siamese..."
                      className={
                        breedError
                          ? "border-red-300 bg-red-50"
                          : ""
                      }
                    />
                    {breedError && (
                      <p className="text-xs text-red-500">
                        {breedError}
                      </p>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      onClick={handleAddBreed}
                      className="bg-indigo-600 hover:bg-indigo-700"
                      disabled={isCreatingBreed}
                    >
                      {isCreatingBreed
                        ? "Saving..."
                        : "Confirm"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsBreedDialogOpen(false);
                        setBreedError("");
                        setBreedName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Search breeds */}
              <div className="space-y-1">
                <Label>Search breeds</Label>
                <Input
                  placeholder="Search breeds..."
                  value={breedSearch}
                  onChange={(e) =>
                    setBreedSearch(e.target.value)
                  }
                />
              </div>

              {/* Breeds list */}
              {filteredBreeds.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No breeds found for this type.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBreeds.map((breed) => (
                    <Card
                      key={breed.breed_id}
                      className="flex items-center justify-between px-4 py-3 shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-indigo-50 text-indigo-700 p-2 flex items-center justify-center">
                          <PawPrint className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">
                            {breed.name}
                          </div>
                          <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-gray-600 bg-gray-50">
                            {selectedType.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Edit breed */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:bg-gray-50"
                          onClick={() =>
                            openEditBreedDialog(breed)
                          }
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>

                        {/* Delete breed */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() =>
                            handleDeleteBreed(breed)
                          }
                          disabled={isDeletingBreed}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Dialog تعديل النوع */}
      <Dialog
        open={isEditTypeDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditTypeDialogOpen(false);
            setTypeBeingEdited(null);
            setEditTypeName("");
            setEditTypeError("");
          } else {
            setIsEditTypeDialogOpen(true);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Edit Pet Type
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Label htmlFor="edit-type-name">
              Type Name
            </Label>
            <Input
              id="edit-type-name"
              value={editTypeName}
              onChange={(e) =>
                setEditTypeName(e.target.value)
              }
              placeholder="Type name"
              className={
                editTypeError
                  ? "border-red-300 bg-red-50"
                  : ""
              }
            />
            {editTypeError && (
              <p className="text-xs text-red-500">
                {editTypeError}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={handleUpdateType}
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={isUpdatingType}
            >
              {isUpdatingType ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditTypeDialogOpen(false);
                setTypeBeingEdited(null);
                setEditTypeName("");
                setEditTypeError("");
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog تعديل السلالة */}
      <Dialog
        open={isEditBreedDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditBreedDialogOpen(false);
            setBreedBeingEdited(null);
            setEditBreedName("");
            setEditBreedError("");
          } else {
            setIsEditBreedDialogOpen(true);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Edit Breed
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Label htmlFor="edit-breed-name">
              Breed Name
            </Label>
            <Input
              id="edit-breed-name"
              value={editBreedName}
              onChange={(e) =>
                setEditBreedName(e.target.value)
              }
              placeholder="Breed name"
              className={
                editBreedError
                  ? "border-red-300 bg-red-50"
                  : ""
              }
            />
            {editBreedError && (
              <p className="text-xs text-red-500">
                {editBreedError}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={handleUpdateBreed}
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={isUpdatingBreed}
            >
              {isUpdatingBreed ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditBreedDialogOpen(false);
                setBreedBeingEdited(null);
                setEditBreedName("");
                setEditBreedError("");
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog مشترك للـ type والـ breed */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            closeDeleteDialog();
          } else {
            setIsDeleteDialogOpen(open);
          }
        }}
        entityLabel={deleteMode === "type" ? "type" : "breed"}
        name={deleteTarget?.name}
        description={
          deleteMode === "type"
            ? "This action cannot be undone. This will permanently delete the type from the system."
            : "This action cannot be undone. This will permanently delete the breed from the system."
        }
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default PetTypesBreedsPage;
