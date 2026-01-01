import React from "react";
import { Button } from "../../../components/ui/button";
import { Eye, Check, XCircle, Loader2 } from "lucide-react";

function splitDateTime(v) {
  if (!v) return { date: "-", time: "" };
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return { date: String(v), time: "" };

  const date = d.toLocaleDateString();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return { date, time };
}

function fmtMoney(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return v ?? "-";
  return n.toFixed(2);
}

function normStatus(v) {
  return String(v ?? "").trim().toLowerCase();
}

function StatusPill({ status }) {
  const s = normStatus(status);
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

  if (s === "pending")
    return (
      <span className={`${base} bg-amber-100 text-amber-800`}>Pending</span>
    );

  if (s === "confirmed")
    return (
      <span className={`${base} bg-emerald-100 text-emerald-800`}>
        Confirmed
      </span>
    );

  if (s === "completed")
    return (
      <span className={`${base} bg-sky-100 text-sky-800`}>Completed</span>
    );

  if (s === "rejected")
    return <span className={`${base} bg-rose-100 text-rose-800`}>Rejected</span>;

  if (s === "cancelled")
    return (
      <span className={`${base} bg-neutral-100 text-neutral-700`}>Cancelled</span>
    );

  return (
    <span className={`${base} bg-neutral-100 text-neutral-700`}>
      {s || "unknown"}
    </span>
  );
}

function DateTimeCell({ value }) {
  const { date, time } = splitDateTime(value);
  return (
    <div className="leading-tight">
      <div className="font-medium text-neutral-900">{date}</div>
      {time ? <div className="text-xs text-neutral-500">{time}</div> : null}
    </div>
  );
}

export default function BoardingReservationTable({
  reservations,
  onView,
  onConfirm,
  onReject,
  busyId,
  isUpdating,
}) {
  if (!reservations?.length) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-600">
        No reservations found.
      </div>
    );
  }

  const safeOnView = typeof onView === "function" ? onView : () => {};

  return (
    <div className="overflow-auto rounded-xl border border-neutral-200">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-50">
          <tr className="text-left text-neutral-600">
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Start</th>
            <th className="px-4 py-3">End</th>
            <th className="px-4 py-3">Hours</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {reservations.map((r) => {
            const disabled = isUpdating || busyId === r.id;

            const status = normStatus(r.status);

            const canConfirm = status === "pending";
            const canReject = status === "pending";

            const handleRowClick = () => {
              if (disabled) return;
              safeOnView(r);
            };

            const handleRowKeyDown = (e) => {
              if (disabled) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                safeOnView(r);
              }
            };

            return (
              <tr
                key={r.id}
                role="button"
                tabIndex={disabled ? -1 : 0}
                onClick={handleRowClick}
                onKeyDown={handleRowKeyDown}
                className={[
                  "border-t border-neutral-200",
                  "hover:bg-neutral-50/60",
                  "transition-colors",
                  disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
                title="Click to view"
              >
                <td className="px-4 py-3 font-medium">{r.id}</td>

                <td className="px-4 py-3">
                  {r.user?.name ?? r.user?.email ?? r.user_id ?? "-"}
                </td>

                <td className="px-4 py-3">
                  <DateTimeCell value={r.start_at} />
                </td>

                <td className="px-4 py-3">
                  <DateTimeCell value={r.end_at} />
                </td>

                <td className="px-4 py-3">{r.billable_hours ?? "-"}</td>

                <td className="px-4 py-3">
                  <StatusPill status={r.status} />
                </td>

                <td className="px-4 py-3">${fmtMoney(r.total)}</td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <div
                    className="flex items-center gap-2 flex-nowrap"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 text-xs gap-1.5"
                      onClick={() => safeOnView(r)}
                      disabled={disabled}
                    >
                      {disabled ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                      View
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      className="h-8 px-2 text-xs gap-1.5"
                      onClick={() => onConfirm?.(r)}
                      disabled={disabled || !canConfirm}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Confirm
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-8 px-2 text-xs gap-1.5"
                      onClick={() => onReject?.(r)}
                      disabled={disabled || !canReject}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
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
