import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import ConfirmDeleteDialog from "../../../components/ui/confirm-delete-dialog";

import {
  useGetAdoptionApplicationByIdQuery,
  useUpdateAdoptionApplicationStatusMutation,
  useDeleteAdoptionApplicationMutation,
} from "../../../features/adoptionApplications/adoptionApplicationsApiSlice";

function formatDate(v) {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
}

function pretty(v) {
  return String(v ?? "-").replaceAll("_", " ");
}

function SectionTitle({ children }) {
  return (
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
      {children}
    </p>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{String(value ?? "-")}</p>
    </div>
  );
}

const getPetCover = (pet) => {
  const raw = pet?.cover_image;
  if (!raw) return null;
  if (typeof raw === "string") return raw;
  return raw?.url || raw?.path || null;
};

const getInitial = (name) => {
  const s = String(name ?? "").trim();
  return s ? s[0].toUpperCase() : "P";
};

function PetAvatar({ src, name }) {
  const initial = getInitial(name);

  return (
    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center flex-shrink-0">
      {src ? (
        <img
          src={src}
          alt={name || "pet"}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full grid place-items-center text-slate-600 font-bold text-lg">
          {initial}
        </div>
      )}
    </div>
  );
}

export default function AdoptionApplicationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, isFetching } =
    useGetAdoptionApplicationByIdQuery(id);

  const [updateStatus, { isLoading: isSaving }] =
    useUpdateAdoptionApplicationStatusMutation();

  const [deleteApp, { isLoading: isDeleting }] =
    useDeleteAdoptionApplicationMutation();

  const app = useMemo(() => data?.data ?? data ?? null, [data]);

  const [status, setStatus] = useState("");

  React.useEffect(() => {
    if (app?.status) setStatus(app.status);
  }, [app?.status]);

  const isDirty = app ? status && status !== app.status : false;
  const statusOptions = ["pending", "approved", "rejected"];

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const openDeleteDialog = () => {
    if (!app?.id) return;
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setIsDeleteDialogOpen(false);
  };

  const onSaveStatus = async () => {
    if (!app?.id) return;
    if (!isDirty) return;

    try {
      await updateStatus({ id: app.id, status }).unwrap();
      toast.success("Application status updated.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status.");
    }
  };

  const confirmDelete = async () => {
    if (!app?.id) return;

    try {
      await deleteApp(app.id).unwrap();
      toast.success(`Application #${app.id} deleted.`);
      navigate("/dashboard/adoption-center");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete application.");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-4">
        <div className="h-10 w-32 bg-slate-100 rounded" />
        <div className="h-7 w-64 bg-slate-100 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-56 bg-slate-100 rounded" />
          <div className="h-56 bg-slate-100 rounded" />
        </div>
        <div className="h-40 bg-slate-100 rounded" />
      </div>
    );
  }

  if (isError || !app) {
    return <div className="p-6 text-red-500">Failed to load application.</div>;
  }

  const petName = app?.pet?.name ?? "-";
  const userName = app?.user?.name ?? "-";
  const userEmail = app?.user?.email ?? "-";
  const petCover = getPetCover(app?.pet);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center">
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <PetAvatar src={petCover} name={petName} />

              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-semibold text-slate-900 truncate">
                  Application {app.id}
                </h1>
                <p className="text-sm text-slate-500 truncate">
                  Pet:{" "}
                  <span className="font-medium text-slate-700">{petName}</span>{" "}
                  • User:{" "}
                  <span className="font-medium text-slate-700">{userName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={openDeleteDialog}
                disabled={isDeleting}
                className="gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>

          {isFetching && (
            <div className="mt-3 text-xs text-slate-400 inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating...
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Details */}
        <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>

          <CardContent className="pt-4 space-y-5">
            <div className="space-y-2">
              <SectionTitle>Application</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoItem label="Application ID" value={app.id} />
                <InfoItem label="Status" value={pretty(app.status)} />
                <InfoItem label="Created at" value={formatDate(app.created_at)} />
                <InfoItem label="Updated at" value={formatDate(app.updated_at)} />
              </div>
            </div>

            <div className="space-y-2">
              <SectionTitle>Pet</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoItem label="Pet ID" value={app.pet_id} />
                <InfoItem label="Pet Name" value={petName} />
                <InfoItem label="Gender" value={pretty(app?.pet?.gender)} />
                <InfoItem
                  label="Date of birth"
                  value={app?.pet?.date_of_birth ?? "-"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <SectionTitle>User</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoItem label="User ID" value={app.user_id} />
                <InfoItem label="User Name" value={userName} />
                <InfoItem label="Email" value={userEmail} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update status */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-base">Update Status</CardTitle>
          </CardHeader>

          <CardContent className="pt-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-600">Status</label>
              <select
                value={status || ""}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {pretty(opt)}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="button"
              onClick={onSaveStatus}
              className="w-full flex items-center justify-center gap-2"
              disabled={!isDirty || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Motivation */}
      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-base">Motivation</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <p className="text-slate-900 whitespace-pre-wrap leading-relaxed">
              {app?.motivation ?? "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDeleteDialog();
          else setIsDeleteDialogOpen(open);
        }}
        entityLabel="application"
        name={app?.id ? `#${app.id}` : ""}
        description="This will permanently delete the adoption application. You can’t undo this action."
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        actionVerb="Delete"
        confirmText="Delete Application"
        loadingText="Deleting..."
        confirmVariant="destructive"
      />
    </div>
  );
}
