import React, { useState, useMemo } from "react";
import {
  Trash2,
  Plus,
  CheckCircle2,
  Pencil,
  Shapes,
  GitBranch,
  Sparkles,
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
    name_en: t.name_en,
    name_ar: t.name_ar,
    breeds: (t.breeds || []).map((b) => ({
      breed_id: b.id,
      name: b.name,
      name_en: b.name_en,
      name_ar: b.name_ar,
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
  return types.filter(
    (t) =>
      (t.name_en || t.name || "").toLowerCase().includes(q) ||
      (t.name_ar || "").toLowerCase().includes(q)
  );
};

const filterBreedsList = (selectedType, search) => {
  if (!selectedType) return [];
  const q = search.trim().toLowerCase();
  const list = selectedType.breeds || [];
  if (!q) return list;
  return list.filter(
    (b) =>
      (b.name_en || b.name || "").toLowerCase().includes(q) ||
      (b.name_ar || "").toLowerCase().includes(q)
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
    const found = types.find((t) => t.type_id === selectedTypeId);
    return found ?? types[0];
  }, [types, selectedTypeId]);

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
  const [deleteTarget, setDeleteTarget] = useState(null); // type or breed
  const [deleteMode, setDeleteMode] = useState(null); // "type" | "breed"
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isDeleting = isDeletingType || isDeletingBreed;

  // ---------- Edit dialogs state ----------

  // Edit type
  const [isEditTypeDialogOpen, setIsEditTypeDialogOpen] =
    useState(false);
  const [typeBeingEdited, setTypeBeingEdited] = useState(null);
  const [editTypeNameEn, setEditTypeNameEn] = useState("");
  const [editTypeNameAr, setEditTypeNameAr] = useState("");
  const [editTypeError, setEditTypeError] = useState("");

  // Edit breed
  const [isEditBreedDialogOpen, setIsEditBreedDialogOpen] =
    useState(false);
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
      const payload = {
        name_en: trimmedEn,
        name_ar: trimmedAr,
        name: trimmedEn,
      };

      const result = await createPetType(payload).unwrap();

      const createdId = result.type_id ?? result.id ?? null;
      if (createdId) {
        setSelectedTypeId(createdId);
      }

      setTypeNameEn("");
      setTypeNameAr("");
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
      alert("You cannot delete a type that has breeds linked to it.");
      return;
    }

    setDeleteMode("type");
    setDeleteTarget(type);
    setIsDeleteDialogOpen(true); // 🚩 هون منفتح ConfirmDeleteDialog
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
        (error?.data?.errors &&
          Object.values(error.data.errors || {})[0]?.[0]) ||
        null;

      setBreedError(
        apiMessage || "Failed to create breed. Please try again."
      );
    }
  };

  const handleDeleteBreed = (breed) => {
    setDeleteMode("breed");
    setDeleteTarget(breed);
    setIsDeleteDialogOpen(true); // 🚩 لما نكبس حذف سلالة، منفتح ConfirmDeleteDialog
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
        if (b.breed_id === breedBeingEdited.breed_id) {
          return false;
        }
        const existing = (b.name_en || b.name || "").toLowerCase();
        return existing === trimmedEn.toLowerCase();
      }) ?? false;

    if (exists) {
      setEditBreedError(
        "This breed already exists for this type."
      );
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
        (error?.data?.errors &&
          Object.values(error.data.errors || {})[0]?.[0]) ||
        null;

      setEditBreedError(
        apiMessage || "Failed to update breed. Please try again."
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
        <p className="text-gray-500">Loading pet types...</p>
      </div>
    );
  }

  if (isTypesError) {
    return (
      <div className="p-6">
        <p className="text-red-500">Failed to load pet types.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
          <Shapes className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Types &amp; Breeds Management
          </h1>
          <p className="text-gray-600 text-sm">
            Organize pet categories and their detailed breeds
          </p>
        </div>
      </div>

      {/* Layout: Left types / Right breeds */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
        {/* ========== LEFT: TYPES ========== */}
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Shapes className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">
                  Pet Types
                </CardTitle>
                <p className="text-xs text-gray-500">
                  Select a category
                </p>
              </div>
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
                  <DialogTitle>Add New Pet Type</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="type-name-en">
                      Type Name (English)
                    </Label>
                    <Input
                      id="type-name-en"
                      value={typeNameEn}
                      onChange={(e) => setTypeNameEn(e.target.value)}
                      placeholder="e.g. Dog, Cat, Bird..."
                      className={typeError ? "border-red-300" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type-name-ar">
                      Type Name (Arabic)
                    </Label>
                    <Input
                      id="type-name-ar"
                      dir="rtl"
                      value={typeNameAr}
                      onChange={(e) => setTypeNameAr(e.target.value)}
                      placeholder="مثال: كلب، قطة، طائر..."
                      className={typeError ? "border-red-300" : ""}
                    />
                  </div>

                  {typeError && (
                    <p className="text-xs text-red-500">{typeError}</p>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    onClick={handleAddType}
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={isCreatingType}
                  >
                    {isCreatingType ? "Saving..." : "Confirm"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsTypeDialogOpen(false);
                      setTypeError("");
                      setTypeNameEn("");
                      setTypeNameAr("");
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
                onChange={(e) => setTypeSearch(e.target.value)}
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
                  selectedType && type.type_id === selectedType.type_id;
                const count = getBreedsCountForType(types, type.type_id);

                return (
                  <div
                    key={type.type_id}
                    onClick={() => setSelectedTypeId(type.type_id)}
                    className={[
                      "flex items-center justify-between rounded-2xl border p-3 cursor-pointer transition shadow-sm",
                      isSelected
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-indigo-50 text-indigo-700 p-2 flex items-center justify-center">
                        <Shapes className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {type.name_en || type.name}
                        </span>
                        {type.name_ar && (
                          <span
                            className="text-xs text-gray-500"
                            dir="rtl"
                          >
                            {type.name_ar}
                          </span>
                        )}
                        <span className="text-[11px] text-gray-400 mt-0.5">
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
                  Select a pet type on the left to view its breeds.
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
                    <div className="rounded-2xl bg-amber-50 text-amber-700 p-3 flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <h2 className="text-xl font-semibold">
                        {selectedType.name_en || selectedType.name} Breeds
                      </h2>
                      <p className="text-xs md:text-sm text-gray-500">
                        {filteredBreeds.length} breeds available
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
                        {selectedType.name_en || selectedType.name}
                      </span>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="breed-name-en">
                        Breed Name (English)
                      </Label>
                      <Input
                        id="breed-name-en"
                        value={breedNameEn}
                        onChange={(e) => setBreedNameEn(e.target.value)}
                        placeholder="e.g. Husky, Persian..."
                        className={breedError ? "border-red-300" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="breed-name-ar">
                        Breed Name (Arabic)
                      </Label>
                      <Input
                        id="breed-name-ar"
                        dir="rtl"
                        value={breedNameAr}
                        onChange={(e) => setBreedNameAr(e.target.value)}
                        placeholder="مثال: هاسكي، فارسي..."
                        className={breedError ? "border-red-300" : ""}
                      />
                    </div>

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
                      {isCreatingBreed ? "Saving..." : "Confirm"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsBreedDialogOpen(false);
                        setBreedError("");
                        setBreedNameEn("");
                        setBreedNameAr("");
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
                  onChange={(e) => setBreedSearch(e.target.value)}
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
                          <GitBranch className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">
                            {breed.name_en || breed.name}
                          </div>
                          {breed.name_ar && (
                            <div
                              className="text-xs text-gray-500"
                              dir="rtl"
                            >
                              {breed.name_ar}
                            </div>
                          )}
                          <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-gray-600 bg-gray-50">
                            {selectedType.name_en || selectedType.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Edit breed */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:bg-gray-50"
                          onClick={() => openEditBreedDialog(breed)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>

                        {/* Delete breed */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteBreed(breed)}
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
            setEditTypeNameEn("");
            setEditTypeNameAr("");
            setEditTypeError("");
          } else {
            setIsEditTypeDialogOpen(true);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Pet Type</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-type-name-en">
                Type Name (English)
              </Label>
              <Input
                id="edit-type-name-en"
                value={editTypeNameEn}
                onChange={(e) => setEditTypeNameEn(e.target.value)}
                placeholder="Type name"
                className={editTypeError ? "border-red-300" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type-name-ar">
                Type Name (Arabic)
              </Label>
              <Input
                id="edit-type-name-ar"
                dir="rtl"
                value={editTypeNameAr}
                onChange={(e) => setEditTypeNameAr(e.target.value)}
                placeholder="اسم النوع"
                className={editTypeError ? "border-red-300" : ""}
              />
            </div>

            {editTypeError && (
              <p className="text-xs text-red-500">{editTypeError}</p>
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
                setEditTypeNameEn("");
                setEditTypeNameAr("");
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
            setEditBreedNameEn("");
            setEditBreedNameAr("");
            setEditBreedError("");
          } else {
            setIsEditBreedDialogOpen(true);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Breed</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-breed-name-en">
                Breed Name (English)
              </Label>
              <Input
                id="edit-breed-name-en"
                value={editBreedNameEn}
                onChange={(e) => setEditBreedNameEn(e.target.value)}
                placeholder="Breed name"
                className={editBreedError ? "border-red-300" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-breed-name-ar">
                Breed Name (Arabic)
              </Label>
              <Input
                id="edit-breed-name-ar"
                dir="rtl"
                value={editBreedNameAr}
                onChange={(e) => setEditBreedNameAr(e.target.value)}
                placeholder="اسم السلالة"
                className={editBreedError ? "border-red-300" : ""}
              />
            </div>

            {editBreedError && (
              <p className="text-xs text-red-500">{editBreedError}</p>
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
                setEditBreedNameEn("");
                setEditBreedNameAr("");
                setEditBreedError("");
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ Delete dialog مشترك للـ type والـ breed */}
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
        name={
          deleteTarget?.name_en ||
          deleteTarget?.name ||
          deleteTarget?.name_ar
        }
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
