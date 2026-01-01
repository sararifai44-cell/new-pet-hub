import React from "react";
import UpsertDialog from "./UpsertDialog";

export default function TypeBreedDialogs({
  // Add Type
  isTypeDialogOpen,
  setIsTypeDialogOpen,
  typeNameEn,
  setTypeNameEn,
  typeNameAr,
  setTypeNameAr,
  typeError,
  setTypeError,
  isCreatingType,
  handleAddType,

  // Edit Type
  isEditTypeDialogOpen,
  setIsEditTypeDialogOpen,
  setTypeBeingEdited,
  editTypeNameEn,
  setEditTypeNameEn,
  editTypeNameAr,
  setEditTypeNameAr,
  editTypeError,
  setEditTypeError,
  isUpdatingType,
  handleUpdateType,

  // Add Breed
  isBreedDialogOpen,
  setIsBreedDialogOpen,
  breedNameEn,
  setBreedNameEn,
  breedNameAr,
  setBreedNameAr,
  breedError,
  setBreedError,
  selectedTypeName,
  isCreatingBreed,
  handleAddBreed,

  // Edit Breed
  isEditBreedDialogOpen,
  setIsEditBreedDialogOpen,
  setBreedBeingEdited,
  editBreedNameEn,
  setEditBreedNameEn,
  editBreedNameAr,
  setEditBreedNameAr,
  editBreedError,
  setEditBreedError,
  isUpdatingBreed,
  handleUpdateBreed,
}) {
  return (
    <>
      <UpsertDialog
        open={isTypeDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsTypeDialogOpen(false);
            setTypeError("");
            setTypeNameEn("");
            setTypeNameAr("");
            return;
          }
          setIsTypeDialogOpen(true);
        }}
        title="Add New Pet Type"
        confirmText="Confirm"
        isLoading={isCreatingType}
        error={typeError}
        fields={[
          {
            id: "type-name-en",
            label: "Type Name (English)",
            value: typeNameEn,
            onChange: (e) => setTypeNameEn(e.target.value),
            placeholder: "e.g. Dog, Cat, Bird...",
          },
          {
            id: "type-name-ar",
            label: "Type Name (Arabic)",
            value: typeNameAr,
            onChange: (e) => setTypeNameAr(e.target.value),
            placeholder: "مثال: كلب، قطة، طائر...",
            dir: "rtl",
          },
        ]}
        onConfirm={handleAddType}
        onCancel={() => {
          setIsTypeDialogOpen(false);
          setTypeError("");
          setTypeNameEn("");
          setTypeNameAr("");
        }}
      />

      <UpsertDialog
        open={isEditTypeDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditTypeDialogOpen(false);
            setTypeBeingEdited(null);
            setEditTypeNameEn("");
            setEditTypeNameAr("");
            setEditTypeError("");
            return;
          }
          setIsEditTypeDialogOpen(true);
        }}
        title="Edit Pet Type"
        confirmText="Save"
        isLoading={isUpdatingType}
        error={editTypeError}
        fields={[
          {
            id: "edit-type-name-en",
            label: "Type Name (English)",
            value: editTypeNameEn,
            onChange: (e) => setEditTypeNameEn(e.target.value),
            placeholder: "Type name",
          },
          {
            id: "edit-type-name-ar",
            label: "Type Name (Arabic)",
            value: editTypeNameAr,
            onChange: (e) => setEditTypeNameAr(e.target.value),
            placeholder: "اسم النوع",
            dir: "rtl",
          },
        ]}
        onConfirm={handleUpdateType}
        onCancel={() => {
          setIsEditTypeDialogOpen(false);
          setTypeBeingEdited(null);
          setEditTypeNameEn("");
          setEditTypeNameAr("");
          setEditTypeError("");
        }}
      />

      <UpsertDialog
        open={isBreedDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsBreedDialogOpen(false);
            setBreedError("");
            setBreedNameEn("");
            setBreedNameAr("");
            return;
          }
          setIsBreedDialogOpen(true);
        }}
        title={
          <>
            Add Breed to <span className="text-indigo-600">{selectedTypeName}</span>
          </>
        }
        confirmText="Confirm"
        isLoading={isCreatingBreed}
        error={breedError}
        fields={[
          {
            id: "breed-name-en",
            label: "Breed Name (English)",
            value: breedNameEn,
            onChange: (e) => setBreedNameEn(e.target.value),
            placeholder: "e.g. Husky, Persian...",
          },
          {
            id: "breed-name-ar",
            label: "Breed Name (Arabic)",
            value: breedNameAr,
            onChange: (e) => setBreedNameAr(e.target.value),
            placeholder: "مثال: هاسكي، فارسي...",
            dir: "rtl",
          },
        ]}
        onConfirm={handleAddBreed}
        onCancel={() => {
          setIsBreedDialogOpen(false);
          setBreedError("");
          setBreedNameEn("");
          setBreedNameAr("");
        }}
      />

      <UpsertDialog
        open={isEditBreedDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditBreedDialogOpen(false);
            setBreedBeingEdited(null);
            setEditBreedNameEn("");
            setEditBreedNameAr("");
            setEditBreedError("");
            return;
          }
          setIsEditBreedDialogOpen(true);
        }}
        title="Edit Breed"
        confirmText="Save"
        isLoading={isUpdatingBreed}
        error={editBreedError}
        fields={[
          {
            id: "edit-breed-name-en",
            label: "Breed Name (English)",
            value: editBreedNameEn,
            onChange: (e) => setEditBreedNameEn(e.target.value),
            placeholder: "Breed name",
          },
          {
            id: "edit-breed-name-ar",
            label: "Breed Name (Arabic)",
            value: editBreedNameAr,
            onChange: (e) => setEditBreedNameAr(e.target.value),
            placeholder: "اسم السلالة",
            dir: "rtl",
          },
        ]}
        onConfirm={handleUpdateBreed}
        onCancel={() => {
          setIsEditBreedDialogOpen(false);
          setBreedBeingEdited(null);
          setEditBreedNameEn("");
          setEditBreedNameAr("");
          setEditBreedError("");
        }}
      />
    </>
  );
}
