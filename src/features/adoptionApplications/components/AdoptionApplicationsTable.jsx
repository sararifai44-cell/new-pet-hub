import React from "react";
import { Button } from "../../../components/ui/button";

const normalize = (v) => String(v ?? "").trim().toLowerCase();

const prettyStatus = (v) => {
  const s = normalize(v);
  if (!s) return "-";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const formatDate = (v) => {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
};

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

export default function AdoptionApplicationsTable({
  applications = [],
  onView,
  onApprove,
  onReject,
  onDelete,
  isUpdating,
  isDeleting,
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr className="border-b border-slate-200">
            {/* ✅ ID قبل الصورة */}
            <th className="text-left p-3 text-slate-600 font-semibold">ID</th>
            <th className="text-left p-3 text-slate-600 font-semibold">Image</th>
            <th className="text-left p-3 text-slate-600 font-semibold">Pet</th>
            <th className="text-left p-3 text-slate-600 font-semibold">User</th>
            <th className="text-left p-3 text-slate-600 font-semibold">Status</th>
            <th className="text-left p-3 text-slate-600 font-semibold">Created</th>
            <th className="text-left p-3 text-slate-600 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((a) => {
            const st = normalize(a.status);
            const isApproved = st === "approved" || st === "accepted";
            const isRejected = st === "rejected";

            const petName = a?.pet?.name ?? "—";
            const img = getPetCover(a?.pet);

            return (
              <tr
                key={a.id}
                role="button"
                tabIndex={0}
                onClick={() => onView?.(a)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onView?.(a);
                }}
                className="border-b border-slate-100 hover:bg-slate-50/60 cursor-pointer"
              >
                {/* ✅ ID بدون # */}
                <td className="p-3 font-medium text-slate-900">{a.id}</td>

                {/* Image */}
                <td className="p-3">
                  <div className="w-10 h-10 rounded-md border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
                    {img ? (
                      <img
                        src={img}
                        alt={petName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center bg-slate-100 text-slate-600 font-bold">
                        {getInitial(petName)}
                      </div>
                    )}
                  </div>
                </td>

                {/* Pet name فقط */}
                <td className="p-3 font-medium text-slate-900">{petName}</td>

                {/* User */}
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">
                      {a?.user?.name ?? "—"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {a?.user?.email ?? "—"}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="p-3">
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium " +
                      (isApproved
                        ? "bg-emerald-50 text-emerald-700"
                        : isRejected
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700")
                    }
                  >
                    {prettyStatus(a.status)}
                  </span>
                </td>

                <td className="p-3 text-slate-700">{formatDate(a.created_at)}</td>

                {/* Actions */}
                <td className="p-3">
                  {/* ✅ يمنع row click */}
                  <div
                    className="flex flex-wrap gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView?.(a);
                      }}
                    >
                      View
                    </Button>

                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onApprove?.(a);
                      }}
                      disabled={isUpdating || isApproved}
                    >
                      Approve
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReject?.(a);
                      }}
                      disabled={isUpdating || isRejected}
                    >
                      Reject
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(a);
                      }}
                      disabled={isDeleting}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
