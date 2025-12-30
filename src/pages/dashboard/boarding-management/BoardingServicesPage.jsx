import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  ClipboardList,
  CheckCircle2,
  XCircle,
  BadgeDollarSign,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import ConfirmDeleteDialog from "../../../components/ui/confirm-delete-dialog";

import {
  useGetBoardingServicesQuery,
  useCreateBoardingServiceMutation,
  useUpdateBoardingServiceMutation,
  useDeleteBoardingServiceMutation,
} from "../../../features/boardingServices/boardingServicesApiSlice";

import BoardingServiceFilters from "../../../features/boardingServices/components/BoardingServiceFilters";
import BoardingServiceTable from "../../../features/boardingServices/components/BoardingServiceTable";
import BoardingServiceFormDialog from "../../../features/boardingServices/components/BoardingServiceFormDialog";

export default function BoardingServicesPage() {
  const [filters, setFilters] = useState({ q: "", active: "", maxPrice: "" });

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [busyId, setBusyId] = useState(null);

  const { data: listRes, isLoading, isError, refetch } = useGetBoardingServicesQuery();

  const [createService, { isLoading: isCreating }] = useCreateBoardingServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateBoardingServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteBoardingServiceMutation();

  const rows = listRes?.data || [];

  // ✅ فلترة: بس English (name_en)
  const filteredRows = useMemo(() => {
    const q = (filters.q || "").trim().toLowerCase();
    const active = (filters.active || "").trim();
    const maxP = (filters.maxPrice || "").trim();
    const maxPrice = maxP ? Number(maxP) : null;

    return rows.filter((s) => {
      const en = String(s?.name_en || "").toLowerCase();
      const matchesQ = !q || en.includes(q);

      const matchesActive =
        active === "" ? true : String(Number(!!s.is_active)) === String(active);

      const priceN = Number(s.price);
      const matchesMaxPrice =
        maxPrice == null || (!Number.isNaN(priceN) && priceN <= maxPrice);

      return matchesQ && matchesActive && matchesMaxPrice;
    });
  }, [rows, filters]);

  // ✅ Stats (على كامل rows)
  const totalServices = rows.length;

  const activeServices = useMemo(
    () => rows.filter((s) => !!s?.is_active).length,
    [rows]
  );
  const inactiveServices = totalServices - activeServices;

  const highestPrice = useMemo(() => {
    const nums = rows
      .map((s) => Number(s?.price))
      .filter((n) => Number.isFinite(n));
    if (!nums.length) return "0.00";
    return Math.max(...nums).toFixed(2);
  }, [rows]);

  const onChangeFilters = (patch) => setFilters((p) => ({ ...p, ...patch }));
  const onResetFilters = () => setFilters({ q: "", active: "", maxPrice: "" });

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (service) => {
    setEditing(service);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (v) => {
    setDialogOpen(v);
    if (!v) setEditing(null);
  };

  const isSubmitting = isCreating || isUpdating;

  const submitDialog = async (payload) => {
    try {
      if (editing?.id) {
        await updateService({
          id: editing.id,
          price: payload.price,
          is_active: payload.is_active,
          name_en: payload.name_en,
          name_ar: payload.name_ar,
        }).unwrap();
        toast.success("Service updated.");
      } else {
        await createService(payload).unwrap();
        toast.success("Service created.");
      }

      handleDialogOpenChange(false);
    } catch (e) {
      toast.error(e?.data?.message || "Save failed.");
    }
  };

  const askDelete = (service) => {
    setDeleteTarget(service);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;
    try {
      setBusyId(deleteTarget.id);
      await deleteService(deleteTarget.id).unwrap();
      toast.success("Service deleted.");
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (e) {
      toast.error(e?.data?.message || "Delete failed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-start gap-3">
          {/* ✅ أيقونة جديدة بدل Wrench */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-indigo-500/5 to-indigo-500/25 flex items-center justify-center border border-indigo-100 shadow-sm">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Boarding Services
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage boarding service catalog, pricing and activation
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" className="border-slate-200" onClick={refetch}>
            Refresh
          </Button>

          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Stats */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-violet-200 bg-violet-50 flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Total Services
                </p>
                <p className="text-lg font-semibold text-slate-900">{totalServices}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-emerald-200 bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Active
                </p>
                <p className="text-lg font-semibold text-slate-900">{activeServices}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-amber-200 bg-amber-50 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Inactive
                </p>
                <p className="text-lg font-semibold text-slate-900">{inactiveServices}</p>
              </div>
            </div>

            {/* ✅ بدل Avg Price */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-blue-200 bg-blue-50 flex items-center justify-center">
                <BadgeDollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Highest Price
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  ${highestPrice}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <BoardingServiceFilters
        filters={filters}
        onChange={(patch) => setFilters((p) => ({ ...p, ...patch }))}
        onReset={onResetFilters}
      />

      {/* Table */}
      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900">
              All Services
            </CardTitle>

            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {filteredRows.length} services
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <BoardingServiceTable
            rows={filteredRows}
            isLoading={isLoading}
            isError={isError}
            onEdit={openEdit}
            onDelete={askDelete}
            busyId={busyId}
          />
        </CardContent>
      </Card>

      {/* Dialog */}
      <BoardingServiceFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        mode={editing?.id ? "edit" : "create"}
        initialValues={editing}
        onSubmit={submitDialog}
        isSubmitting={isSubmitting}
      />

      {/* Delete confirm */}
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!open && isDeleting) return;
          setDeleteOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        entityLabel="service"
        name={deleteTarget?.name_en || "Service"}
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
