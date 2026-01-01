// src/pages/dashboard/boarding-management/BoardingReservationDetailsPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, CalendarClock } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

import {
  useGetBoardingReservationByIdQuery,
  useUpdateBoardingReservationStatusMutation,
} from "../../../features/boardingReservations/boardingReservationsApiSlice";

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

function fmtMoney(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return v ?? "-";
  return n.toFixed(2);
}

function getAllowedAdminStatuses(current) {
  const s = String(current || "").toLowerCase();

  if (s === "cancelled") return ["cancelled"];

  if (s === "rejected") return ["rejected"];
  if (s === "completed") return ["completed"];

  if (s === "pending") return ["pending", "confirmed", "rejected"];
  if (s === "confirmed") return ["confirmed", "completed"];

  return [s || "pending"];
}

export default function BoardingReservationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, isFetching } =
    useGetBoardingReservationByIdQuery(id);

  const [updateStatus, { isLoading: isSaving }] =
    useUpdateBoardingReservationStatusMutation();

  const reservation = useMemo(() => data?.data ?? data ?? null, [data]);

  const [status, setStatus] = useState("");

  React.useEffect(() => {
    if (reservation?.status) setStatus(reservation.status);
  }, [reservation?.status]);

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

  if (isError || !reservation) {
    return <div className="p-6 text-red-500">Failed to load reservation.</div>;
  }

  const allowed = getAllowedAdminStatuses(reservation.status);
  const statusLocked =
    allowed.length === 1 &&
    allowed[0] === String(reservation.status).toLowerCase();

  const isDirty = status && status !== reservation.status;

  const onSaveStatus = async () => {
    if (!reservation?.id) return;
    if (!isDirty) return;

    try {
      await updateStatus({ id: reservation.id, status }).unwrap();
      toast.success("Reservation status updated.");
    } catch (e) {
      console.error(e);
      toast.error(e?.data?.message || "Failed to update status.");
    }
  };

  const services = Array.isArray(reservation.services) ? reservation.services : [];

  const userLabel =
    reservation.user?.name ??
    reservation.user?.email ??
    reservation.user_id ??
    "-";

  const petTypeLabel =
    reservation.pet_type?.name ?? reservation.pet_type_id ?? "-";

  const petBreedLabel =
    reservation.pet_breed?.name ?? reservation.pet_breed_id ?? "-";

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Back */}
      <div className="flex items-center">
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Header card */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0">
                <CalendarClock className="w-5 h-5 text-slate-700" />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-semibold text-slate-900 truncate">
                  Reservation #{reservation.id}
                </h1>
                <p className="text-sm text-slate-500 truncate">
                  User:{" "}
                  <span className="font-medium text-slate-700">{userLabel}</span>{" "}
                  • Status:{" "}
                  <span className="font-medium text-slate-700">
                    {pretty(reservation.status)}
                  </span>
                </p>
              </div>
            </div>

            {isFetching && (
              <div className="text-xs text-slate-400 inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </div>
            )}
          </div>
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
              <SectionTitle>Reservation</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoItem label="Reservation ID" value={reservation.id} />
                <InfoItem label="Status" value={pretty(reservation.status)} />

                <InfoItem label="User" value={userLabel} />

                <InfoItem label="Age (months)" value={reservation.age_months} />

                <InfoItem label="Pet Type" value={petTypeLabel} />
                <InfoItem label="Pet Breed" value={petBreedLabel} />

                <InfoItem label="Start" value={formatDate(reservation.start_at)} />
                <InfoItem label="End" value={formatDate(reservation.end_at)} />
                <InfoItem label="Billable Hours" value={reservation.billable_hours} />
                <InfoItem label="Total" value={`$${fmtMoney(reservation.total)}`} />
                <InfoItem label="Created at" value={formatDate(reservation.created_at)} />
                <InfoItem label="Updated at" value={formatDate(reservation.updated_at)} />
              </div>
            </div>

            {/* Services */}
            <div className="space-y-2">
              <SectionTitle>Services</SectionTitle>

              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 text-sm font-medium text-slate-700">
                  Services ({services.length})
                </div>

                {services.length ? (
                  <table className="min-w-full text-sm">
                    <thead className="bg-white">
                      <tr className="text-left text-slate-600 border-t border-slate-100">
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Name (EN)</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((s) => (
                        <tr key={s.id} className="border-t border-slate-100">
                          <td className="px-4 py-2">{s.id}</td>
                          <td className="px-4 py-2">{s.name_en || "-"}</td>
                          <td className="px-4 py-2">${fmtMoney(s.price)}</td>
                          <td className="px-4 py-2">{s.is_active ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-4 py-4 text-sm text-slate-600">
                    No services attached.
                  </div>
                )}
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
                disabled={statusLocked}
                className="mt-1 w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
              >
                {allowed.map((opt) => (
                  <option key={opt} value={opt}>
                    {pretty(opt)}
                  </option>
                ))}
              </select>

              {String(reservation.status).toLowerCase() === "cancelled" && (
                <p className="mt-2 text-xs text-slate-500">
                  Cancelled is user-only action. Admin can’t change it.
                </p>
              )}
            </div>

            <Button
              type="button"
              onClick={onSaveStatus}
              className="w-full flex items-center justify-center gap-2"
              disabled={!isDirty || isSaving || statusLocked}
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
    </div>
  );
}
