import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

const toNumberOrNull = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export default function BoardingServiceFormCard({
  mode, // "create" | "edit"
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  const [form, setForm] = useState({
    name_en: "",
    name_ar: "",
    price: "",
    is_active: true,
  });

  useEffect(() => {
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
  }, [initialValues]);

  const errors = useMemo(() => {
    const next = {};
    if (!String(form.name_en).trim()) next.name_en = "name_en is required";
    if (!String(form.name_ar).trim()) next.name_ar = "name_ar is required";

    const p = toNumberOrNull(form.price);
    if (p === null) next.price = "price must be a number";
    else if (p < 0) next.price = "price must be >= 0";

    return next;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0 && !isSubmitting;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit({
      name_en: String(form.name_en).trim(),
      name_ar: String(form.name_ar).trim(),
      price: String(form.price).trim(),
      is_active: form.is_active ? 1 : 0,
    });
  };

  return (
    <Card className="rounded-2xl border-neutral-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {mode === "edit" ? `Edit Service #${initialValues?.id}` : "Add Service"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field
            label="Name EN"
            value={form.name_en}
            onChange={(v) => setForm((p) => ({ ...p, name_en: v }))}
            error={errors.name_en}
          />
          <Field
            label="Name AR"
            value={form.name_ar}
            onChange={(v) => setForm((p) => ({ ...p, name_ar: v }))}
            error={errors.name_ar}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field
            label="Price"
            value={form.price}
            onChange={(v) => setForm((p) => ({ ...p, price: v }))}
            error={errors.price}
            placeholder="e.g. 25.00"
          />

          <div>
            <label className="block text-xs text-neutral-500 mb-1">Active</label>
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

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={submit} disabled={!canSubmit}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, value, onChange, error, placeholder }) {
  return (
    <div>
      <label className="block text-xs text-neutral-500 mb-1">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      {error ? <div className="text-xs text-rose-600 mt-1">{error}</div> : null}
    </div>
  );
}
