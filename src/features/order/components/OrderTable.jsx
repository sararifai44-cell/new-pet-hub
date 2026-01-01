import React from "react";
import { Eye, Ban } from "lucide-react";
import { Button } from "../../../components/ui/button";

const pretty = (v) => String(v ?? "-").replaceAll("_", " ");

function statusBadge(status) {
  const s = (status || "").toLowerCase();
  if (s === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
  if (s === "in_progress") return "bg-sky-50 text-sky-700 border-sky-200";
  if (s === "shipped") return "bg-indigo-50 text-indigo-700 border-indigo-200";
  if (s === "completed") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "cancelled") return "bg-red-50 text-red-700 border-red-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

function payBadge(status) {
  const s = (status || "").toLowerCase();
  if (s === "paid") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "unpaid") return "bg-amber-50 text-amber-700 border-amber-200";
  if (s === "refunded") return "bg-slate-100 text-slate-700 border-slate-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

function formatMoney(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return v ?? "-";
  return n.toFixed(2);
}

function formatDate(v) {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
}

export default function OrderTable({ orders, onView, onCancel, isCancelling }) {
  if (!orders || orders.length === 0) {
    return <p className="text-center text-slate-500 py-10">No orders found.</p>;
  }

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr className="border-b border-slate-200">
            <th className="text-left p-3 text-slate-600 font-semibold">ID</th>
            <th className="text-left p-3 text-slate-600 font-semibold">Customer</th>
            <th className="text-left p-3 text-slate-600 font-semibold">Items</th>
            <th className="text-left p-3 text-slate-600 font-semibold">Total</th>
            <th className="text-left p-3 text-slate-600 font-semibold">Status</th>
            <th className="text-left p-3 text-slate-600 font-semibold">Payment</th>
            <th className="text-left p-3 text-slate-600 font-semibold">Created</th>
            <th className="text-left p-3 text-slate-600 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => {
            const st = (o.status || "").toLowerCase();
            const canCancel = !["cancelled", "completed"].includes(st);

            const customerName = o?.user?.user_name ?? "-";
            const userId = o?.user?.user_id ?? "-";

            const items = Array.isArray(o?.items) ? o.items : [];
            const itemsCount = items.reduce(
              (sum, it) => sum + Number(it?.quantity || 0),
              0
            );

            const goDetails = () => onView?.(o);

            return (
              <tr
                key={o.id}
                onClick={goDetails}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") goDetails();
                }}
                className="border-b border-slate-100 hover:bg-slate-50/60 cursor-pointer transition-colors"
              >
                {/* ID */}
                <td className="p-3 font-medium text-slate-900">#{o.id}</td>

                {/* Customer */}
                <td className="p-3 text-slate-700">
                  <div className="flex flex-col">
                    <span className="font-medium">{customerName}</span>
                    <span className="text-xs text-slate-400">User ID: {userId}</span>
                  </div>
                </td>

                {/* Items */}
                <td className="p-3 text-slate-700">
                  <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                    {itemsCount} item{itemsCount === 1 ? "" : "s"}
                  </span>
                </td>

                {/* Total */}
                <td className="p-3 text-slate-700">{formatMoney(o.total)}</td>

                {/* Status */}
                <td className="p-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${statusBadge(
                      o.status
                    )}`}
                  >
                    {pretty(o.status)}
                  </span>
                </td>

                {/* Payment */}
                <td className="p-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${payBadge(
                      o.payment_status
                    )}`}
                  >
                    {pretty(o.payment_status)}
                  </span>
                </td>

                {/* Created */}
                <td className="p-3 text-slate-700">{formatDate(o.created_at)}</td>

                <td className="p-3" onClick={stop}>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={(e) => {
                        stop(e);
                        onView?.(o);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                      disabled={!canCancel || isCancelling}
                      title={!canCancel ? "Cannot cancel this order" : "Cancel order"}
                      onClick={(e) => {
                        stop(e);
                        onCancel?.(o);
                      }}
                    >
                      <Ban className="w-4 h-4" />
                      Cancel
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
