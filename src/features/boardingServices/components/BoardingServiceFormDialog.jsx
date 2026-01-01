import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";

const toNumberOrNull = (v) => {
  const s = String(v ?? "").trim();
  if (!s) return null; // empty invalid
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

export default function BoardingServiceFormDialog({
  open,
  onOpenChange,
  mode, // "create" | "edit"
  initialValues,
  onSubmit,
  isSubmitting,
}) {
  const [form, setForm] = useState({
    name_en: "",
    name_ar: "",
    price: "",
    is_active: true,
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setSubmitted(false);

      if (initialValues) {
        setForm({
          name_en: initialValues.name_en ?? "",
          name_ar: initialValues.name_ar ?? "",
          price: initialValues.price ?? "",
          is_active: !!initialValues.is_active,
        });
      } else {
        setForm({ name_en: "", name_ar: "", price: "", is_active: true });
      }
    }
  }, [open, initialValues]);

  const errors = useMemo(() => {
    const next = {};

    if (mode === "create") {
      if (!String(form.name_en).trim()) next.name_en = "Name EN is required";
      if (!String(form.name_ar).trim()) next.name_ar = "Name AR is required";
    }

    const rawPrice = String(form.price ?? "").trim();
    if (!rawPrice) next.price = "Price is required";
    else {
      const p = toNumberOrNull(rawPrice);
      if (p === null) next.price = "Price must be a number";
      else if (p < 0) next.price = "Price must be >= 0";
    }

    return next;
  }, [form, mode]);

  const hasErrors = Object.keys(errors).length > 0;

  const showError = (key) => (submitted ? errors[key] : "");

  const submit = () => {
    setSubmitted(true);
    if (hasErrors || isSubmitting) return;

    const payload = {
      name_en: String(form.name_en).trim(),
      name_ar: String(form.name_ar).trim(),
      price: String(form.price).trim(),
      is_active: form.is_active ? 1 : 0,
    };

    onSubmit(payload);
  };

  const title =
    mode === "edit"
      ? `Edit Service #${initialValues?.id}`
      : "Add Service";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base">{title}</DialogTitle>
          <DialogDescription className="text-sm">
            {mode === "edit"
              ? "Update price/active (and optionally names)."
              : "Create a new boarding service."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Name EN"
              value={form.name_en}
              onChange={(v) => setForm((p) => ({ ...p, name_en: v }))}
              error={showError("name_en")}
              placeholder="e.g. Training"
            />
            <Field
              label="Name AR"
              value={form.name_ar}
              onChange={(v) => setForm((p) => ({ ...p, name_ar: v }))}
              error={showError("name_ar")}
              placeholder="مثال: تدريب"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Price"
              value={form.price}
              onChange={(v) => setForm((p) => ({ ...p, price: v }))}
              error={showError("price")}
              placeholder="e.g. 25.00"
            />

            <div>
              <label className="block text-xs text-neutral-500 mb-1">
                Active
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 px-3 h-10">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, is_active: e.target.checked }))
                  }
                />
                <span className="text-sm text-neutral-700">
                  {form.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="button" onClick={submit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, onChange, error, placeholder }) {
  return (
    <div>
      <label className="block text-xs text-neutral-500 mb-1">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {error ? <div className="text-xs text-rose-600 mt-1">{error}</div> : null}
    </div>
  );
}
