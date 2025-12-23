import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Clock3, Truck, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

import OrderFilters from "../../../features/order/components/OrderFilters";
import OrderTable from "../../../features/order/components/OrderTable";

import ConfirmDeleteDialog from "../../../components/ui/confirm-delete-dialog";

import { useGetOrdersQuery, useCancelOrderMutation } from "../../../features/order/orderApiSlice";

const PAGE_SIZE = 10;

const INITIAL_FILTERS = {
  search: "",
  status: "",
  payment_status: "",
  sort: "newest",
};

const safeTime = (v) => {
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? 0 : t;
};

export default function OrdersListPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
    toast.info("Filters reset.");
  };

  const { data, isLoading, isError, isFetching, refetch } = useGetOrdersQuery();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const orders = useMemo(() => {
    const list = data?.data ?? data ?? [];
    return Array.isArray(list) ? list : [];
  }, [data]);

  // ✅ فلترة من الرياكت
  const filteredOrders = useMemo(() => {
    const search = (filters.search || "").trim().toLowerCase();
    const status = (filters.status || "").toLowerCase();
    const pay = (filters.payment_status || "").toLowerCase();

    return orders.filter((o) => {
      const oStatus = (o.status || "").toLowerCase();
      const oPay = (o.payment_status || "").toLowerCase();

      if (status && oStatus !== status) return false;
      if (pay && oPay !== pay) return false;

      if (search) {
        const hay = [
          o.id,
          o.user?.user_id,
          o.user?.user_name,
          o.total,
          o.status,
          o.payment_status,
        ]
          .filter((v) => v !== null && v !== undefined)
          .join(" ")
          .toLowerCase();

        if (!hay.includes(search)) return false;
      }

      return true;
    });
  }, [orders, filters.search, filters.status, filters.payment_status]);

  // ✅ Sorting (حسب filters.sort)
  const sortedOrders = useMemo(() => {
    const sortKey = filters.sort || "newest";
    const arr = [...filteredOrders];

    arr.sort((a, b) => {
      if (sortKey === "newest") return safeTime(b.created_at) - safeTime(a.created_at);
      if (sortKey === "oldest") return safeTime(a.created_at) - safeTime(b.created_at);

      const ta = Number(a.total ?? 0);
      const tb = Number(b.total ?? 0);

      if (sortKey === "total_desc") return tb - ta;
      if (sortKey === "total_asc") return ta - tb;

      return 0;
    });

    return arr;
  }, [filteredOrders, filters.sort]);

  // ✅ رجّعي الصفحة للأول عند تغيير الفلاتر/السورت
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // ✅ Pagination مثل PetListPage
  const totalPages =
    sortedOrders.length === 0 ? 1 : Math.ceil(sortedOrders.length / PAGE_SIZE);

  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedOrders = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return sortedOrders.slice(start, start + PAGE_SIZE);
  }, [sortedOrders, safePage]);

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(clamped);
  };

  // ✅ Stats (على filteredOrders)
  const stats = useMemo(() => {
    const total = filteredOrders.length;
    const count = (s) => filteredOrders.filter((o) => (o.status || "").toLowerCase() === s).length;

    return {
      total,
      pending: count("pending"),
      in_progress: count("in_progress"),
      shipped: count("shipped"),
      completed: count("completed"),
      cancelled: count("cancelled"),
    };
  }, [filteredOrders]);

  const handleView = (order) => navigate(`/dashboard/store-management/orders/${order.id}`);

  // ✅ Cancel Dialog (بدل confirm/alert)
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const openCancelDialog = (order) => {
    setOrderToCancel(order);
    setIsCancelDialogOpen(true);
  };

  const closeCancelDialog = () => {
    if (isCancelling) return;
    setIsCancelDialogOpen(false);
    setOrderToCancel(null);
  };

  const confirmCancel = async () => {
    if (!orderToCancel?.id) return;

    try {
      await cancelOrder(orderToCancel.id).unwrap();
      toast.success(`Order #${orderToCancel.id} cancelled.`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to cancel order.");
    } finally {
      setIsCancelDialogOpen(false);
      setOrderToCancel(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Store Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage store orders.</p>
        </div>

        <Button type="button" variant="outline" onClick={() => refetch()} className="text-xs" disabled={isFetching}>
          {isFetching ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Refreshing...
            </span>
          ) : (
            "Refresh"
          )}
        </Button>
      </div>

      {/* Stats */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatItem icon={<ClipboardList className="w-4 h-4 text-violet-600" />} label="Total" value={stats.total} ring="violet" />
            <StatItem icon={<Clock3 className="w-4 h-4 text-amber-600" />} label="Pending" value={stats.pending} ring="amber" />
            <StatItem icon={<Truck className="w-4 h-4 text-sky-600" />} label="In progress" value={stats.in_progress} ring="sky" />
            <StatItem icon={<Truck className="w-4 h-4 text-indigo-600" />} label="Shipped" value={stats.shipped} ring="indigo" />
            <StatItem icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />} label="Completed" value={stats.completed} ring="emerald" />
            <StatItem icon={<XCircle className="w-4 h-4 text-red-600" />} label="Cancelled" value={stats.cancelled} ring="red" />
          </div>
        </CardContent>
      </Card>

      {/* Filters (فيه Sort هلا) */}
      <OrderFilters
        filters={filters}
        onFilterChange={(updaterOrValue) => {
          setFilters((prev) =>
            typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue
          );
          setCurrentPage(1);
        }}
        onReset={resetFilters}
      />

      {/* Table */}
      <Card className="shadow-sm border border-slate-100 bg-white relative">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-lg font-semibold text-slate-900">Orders</CardTitle>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {filteredOrders.length} orders
            </span>
          </div>
        </CardHeader>

        {/* Updating overlay */}
        {isFetching && !isLoading && (
          <div className="absolute inset-x-0 top-[66px] h-10 bg-white/70 backdrop-blur flex items-center justify-center border-b border-slate-100">
            <span className="text-xs text-slate-500 inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating...
            </span>
          </div>
        )}

        <CardContent className="pt-4">
          {isLoading ? (
            <p className="text-center text-slate-500 py-8">Loading orders...</p>
          ) : isError ? (
            <p className="text-center text-red-500 py-8">Failed to load orders.</p>
          ) : (
            <>
              <OrderTable
                orders={paginatedOrders}
                onView={handleView}
                onCancel={(order) => {
                  const st = (order.status || "").toLowerCase();
                  if (["cancelled", "completed"].includes(st)) return;
                  openCancelDialog(order);
                }}
                isCancelling={isCancelling}
              />

              {/* ✅ Pagination مثل PetListPage */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-4">
                <div className="text-sm text-gray-500">
                  Page {safePage} of {totalPages}
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage === 1}
                    onClick={() => goToPage(safePage - 1)}
                    className="flex items-center gap-1"
                  >
                    &lt; Previous
                  </Button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNumber = idx + 1;
                    const isActive = pageNumber === safePage;

                    return (
                      <Button
                        key={pageNumber}
                        size="sm"
                        variant={isActive ? "default" : "outline"}
                        onClick={() => goToPage(pageNumber)}
                        className={
                          "w-9 h-9 px-0 text-sm " +
                          (isActive
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-white text-gray-700 hover:bg-gray-50")
                        }
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={safePage === totalPages}
                    onClick={() => goToPage(safePage + 1)}
                    className="flex items-center gap-1"
                  >
                    Next &gt;
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Confirm Cancel Dialog */}
      <ConfirmDeleteDialog
        open={isCancelDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeCancelDialog();
          else setIsCancelDialogOpen(open);
        }}
        entityLabel="order"
        name={orderToCancel?.id ? `#${orderToCancel.id}` : ""}
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
}

function StatItem({ icon, label, value, ring }) {
  const ringMap = {
    violet: "border-violet-200 bg-violet-50",
    amber: "border-amber-200 bg-amber-50",
    sky: "border-sky-200 bg-sky-50",
    indigo: "border-indigo-200 bg-indigo-50",
    emerald: "border-emerald-200 bg-emerald-50",
    red: "border-red-200 bg-red-50",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-full border flex items-center justify-center ${ringMap[ring] || ringMap.violet}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
