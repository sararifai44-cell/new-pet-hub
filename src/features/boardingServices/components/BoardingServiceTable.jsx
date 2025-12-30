import React from "react";
import { Button } from "../../../components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

function fmtMoney(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return v ?? "-";
  return n.toFixed(2);
}

function fmtDate(v) {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
}

function StatusPill({ active }) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  return active ? (
    <span className={`${base} bg-emerald-100 text-emerald-800`}>Active</span>
  ) : (
    <span className={`${base} bg-neutral-100 text-neutral-700`}>Inactive</span>
  );
}

export default function BoardingServiceTable({
  rows,
  isLoading,
  isError,
  onEdit,
  onDelete,
  busyId,
}) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-600">
        Loading services...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-dashed border-rose-300 p-6 text-center text-sm text-rose-700">
        Failed to load services.
      </div>
    );
  }

  if (!rows?.length) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-600">
        No services found.
      </div>
    );
  }

  const safeOnEdit = typeof onEdit === "function" ? onEdit : () => {};

  return (
    <div className="overflow-auto rounded-xl border border-neutral-200">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-50">
          <tr className="text-left text-neutral-600">
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Name (EN)</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Active</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Updated</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((s) => {
            const disabled = busyId === s.id;
            const active = !!s.is_active;

            const handleRowClick = () => {
              if (disabled) return;
              safeOnEdit(s); // ✅ كبسة على السطر = Edit
            };

            const handleRowKeyDown = (e) => {
              if (disabled) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                safeOnEdit(s);
              }
            };

            return (
              <tr
                key={s.id}
                role="button"
                tabIndex={disabled ? -1 : 0}
                onClick={handleRowClick}
                onKeyDown={handleRowKeyDown}
                className={[
                  "border-t border-neutral-200 hover:bg-neutral-50/60 transition-colors",
                  disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
                title="Click to edit"
              >
                <td className="px-4 py-3 font-medium">{s.id}</td>

                {/* ✅ فقط EN */}
                <td className="px-4 py-3">{s.name_en || "-"}</td>

                <td className="px-4 py-3">${fmtMoney(s.price)}</td>

                <td className="px-4 py-3">
                  <StatusPill active={active} />
                </td>

                <td className="px-4 py-3">{fmtDate(s.created_at)}</td>
                <td className="px-4 py-3">{fmtDate(s.updated_at)}</td>

                {/* ✅ Actions جنب بعض بدون ما يفعّل row click */}
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
                      className="gap-2"
                      onClick={() => safeOnEdit(s)}
                      disabled={disabled}
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      disabled={disabled}
                      onClick={() => onDelete?.(s)}
                    >
                      <Trash2 className="w-4 h-4" />
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
