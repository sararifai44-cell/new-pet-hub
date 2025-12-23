import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2, ImageOff } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import ConfirmDeleteDialog from "../../../components/ui/confirm-delete-dialog";

import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} from "../../../features/order/orderApiSlice";

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

function pretty(v) {
  return String(v ?? "-").replaceAll("_", " ");
}

function getProductImage(product) {
  const raw =
    product?.image_url ||
    product?.image ||
    product?.thumbnail ||
    (Array.isArray(product?.images) ? product.images[0] : null);

  if (!raw) return null;
  if (typeof raw === "string") return raw;
  return raw?.url || raw?.path || null;
}

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, isFetching } = useGetOrderByIdQuery(id);

  const [updateStatus, { isLoading: isSaving }] = useUpdateOrderStatusMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const order = useMemo(() => data?.data ?? data ?? null, [data]);
  const items = useMemo(() => (Array.isArray(order?.items) ? order.items : []), [order]);

  const [status, setStatus] = useState("");

  React.useEffect(() => {
    if (order?.status) setStatus(order.status);
  }, [order?.status]);

  const canCancel = order
    ? !["cancelled", "completed"].includes((order.status || "").toLowerCase())
    : false;

  const isDirty = order ? status && status !== order.status : false;

  // ✅ Confirm dialog state بدل confirm/alert
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const openCancelDialog = () => {
    if (!order?.id) return;
    if (!canCancel) return;
    setIsCancelDialogOpen(true);
  };

  const closeCancelDialog = () => {
    if (isCancelling) return;
    setIsCancelDialogOpen(false);
  };

  const onSaveStatus = async () => {
    if (!order?.id) return;
    if (!isDirty) return;

    try {
      await updateStatus({ id: order.id, status }).unwrap();
      toast.success("Order status updated.");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status.");
    }
  };

  // ✅ صار الإلغاء يتم من داخل الديالوج
  const confirmCancel = async () => {
    if (!order?.id) return;
    if (!canCancel) return;

    try {
      await cancelOrder(order.id).unwrap();
      toast.success(`Order #${order.id} cancelled.`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to cancel order.");
    } finally {
      setIsCancelDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-4">
        <div className="h-9 w-28 bg-slate-100 rounded" />
        <div className="h-8 w-56 bg-slate-100 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-48 bg-slate-100 rounded" />
          <div className="h-48 bg-slate-100 rounded" />
        </div>
        <div className="h-64 bg-slate-100 rounded" />
      </div>
    );
  }

  if (isError || !order) return <div className="p-6 text-red-500">Failed to load order.</div>;

  const customerName = order?.user?.user_name ?? "-";
  const userId = order?.user?.user_id ?? "-";

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {isFetching && (
          <span className="text-xs text-slate-400 inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating...
          </span>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Order #{order.id}</h1>
          <p className="text-sm text-slate-500 mt-1">
            Customer: <span className="font-medium text-slate-700">{customerName}</span> (User ID: {userId})
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={openCancelDialog}
            disabled={!canCancel || isCancelling}
          >
            {isCancelling ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Cancelling...
              </span>
            ) : (
              "Cancel Order"
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <InfoRow label="Order ID" value={order.id} />
              <InfoRow label="Customer" value={customerName} />
              <InfoRow label="User ID" value={userId} />
              <InfoRow label="Total" value={formatMoney(order.total)} />
              <InfoRow label="Payment" value={pretty(order.payment_status)} />
              <InfoRow label="Status" value={pretty(order.status)} />
              <InfoRow label="Created at" value={formatDate(order.created_at)} />
            </div>
          </CardContent>
        </Card>

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
                <option value="pending">Pending</option>
                <option value="in_progress">In progress</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <Button
              type="button"
              onClick={onSaveStatus}
              className="w-full flex items-center gap-2"
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
                  Save
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-base">Order Items</CardTitle>
        </CardHeader>

        <CardContent className="pt-4">
          {items.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No items found for this order.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="text-left p-3 text-slate-600 font-semibold">Image</th>
                    <th className="text-left p-3 text-slate-600 font-semibold">Product</th>
                    <th className="text-left p-3 text-slate-600 font-semibold">Qty</th>
                    <th className="text-left p-3 text-slate-600 font-semibold">Unit price</th>
                    <th className="text-left p-3 text-slate-600 font-semibold">Line total</th>
                    <th className="text-left p-3 text-slate-600 font-semibold">Added</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((it) => {
                    const p = it.product;
                    const img = getProductImage(p);

                    return (
                      <tr key={it.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                        <td className="p-3">
                          <div className="w-10 h-10 rounded-md border border-slate-200 bg-white overflow-hidden flex items-center justify-center">
                            {img ? (
                              <img
                                src={img}
                                alt={p?.name || "product"}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="text-slate-400">
                                <ImageOff className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">{p?.name ?? "—"}</span>
                            <span className="text-xs text-slate-500">Product ID: {it.product_id}</span>
                          </div>
                        </td>

                        <td className="p-3 text-slate-700">{it.quantity}</td>
                        <td className="p-3 text-slate-700">{formatMoney(it.unit_price)}</td>
                        <td className="p-3 text-slate-700">{formatMoney(it.line_total)}</td>
                        <td className="p-3 text-slate-700">{formatDate(it.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ✅ Confirm Cancel Dialog */}
      <ConfirmDeleteDialog
        open={isCancelDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeCancelDialog();
          else setIsCancelDialogOpen(open);
        }}
        entityLabel="order"
        name={order?.id ? `#${order.id}` : ""}
        description="This will cancel the order. You can’t undo this action."
        isLoading={isCancelling}
        onConfirm={confirmCancel}
        actionVerb="Cancel"
        confirmText="Cancel Order"
        loadingText="Cancelling..."
        confirmVariant="destructive"
      />
    </div>
  );
};

function InfoRow({ label, value }) {
  return (
    <div className="rounded-md border border-slate-100 bg-white p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-900">{String(value ?? "-")}</p>
    </div>
  );
}

export default OrderDetailsPage;
