// src/components/ui/confirm-delete-dialog.jsx
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
  entityLabel = "item", // "pet" | "breed" | "type" ...
  name,
  description,
  isLoading = false,
  onConfirm,
}) => {
  const handleCancel = () => {
    if (isLoading) return;
    onOpenChange?.(false);
  };

  const handleDelete = () => {
    if (isLoading) return;
    onConfirm?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {entityLabel}{" "}
            <span className="font-semibold text-red-600">{name}</span>?
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
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
