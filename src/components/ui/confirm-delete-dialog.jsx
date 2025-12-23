import React from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";

const ConfirmDeleteDialog = ({
  open,
  onOpenChange,
  entityLabel = "item",
  name,
  description,
  isLoading = false,
  onConfirm,

  // ✅ إضافات جديدة (اختيارية) لتخليه ينفع للإلغاء كمان
  title, // إذا بدك عنوان مخصص بالكامل
  actionVerb = "Delete", // Delete | Cancel | Remove ...
  confirmText = "Delete",
  loadingText = "Deleting...",
  confirmVariant = "destructive", // destructive | default | outline | secondary...
  cancelText = "Cancel",
}) => {
  const handleCancel = () => {
    if (isLoading) return;
    onOpenChange?.(false);
  };

  const handleConfirm = () => {
    if (isLoading) return;
    onConfirm?.();
  };

  const finalTitle =
    title ||
    `${actionVerb} ${entityLabel} ${
      name ? "" : ""
    } ${name ? "" : ""}`.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title ? (
              title
            ) : (
              <>
                {actionVerb} {entityLabel}{" "}
                <span className="font-semibold text-red-600">{name}</span>?
              </>
            )}
          </DialogTitle>

          <DialogDescription>
            {description ||
              `This action cannot be undone. This will permanently delete the ${entityLabel} from the system.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? loadingText : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
