import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

import BoardingReservationsStats from "../../../features/boardingReservations/components/BoardingReservationsStats";
import BoardingReservationFilters from "../../../features/boardingReservations/components/BoardingReservationFilters";
import BoardingReservationTable from "../../../features/boardingReservations/components/BoardingReservationTable";

import {
  useGetBoardingReservationsQuery,
  useUpdateBoardingReservationStatusMutation,
} from "../../../features/boardingReservations/boardingReservationsApiSlice";

const PAGE_SIZE = 10;

const INITIAL_FILTERS = {
  search: "",
  status: "",
  sort: "newest",
};

const normalize = (v) => String(v ?? "").trim().toLowerCase();

const safeTime = (v) => {
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? 0 : t;
};

export default function TemporaryBookingsPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const [busyId, setBusyId] = useState(null);

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
    toast.info("Filters reset.");
  };

  const { data, isLoading, isError, isFetching, refetch } =
    useGetBoardingReservationsQuery();

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateBoardingReservationStatusMutation();

  const reservations = useMemo(() => {
    const list = data?.data ?? data ?? [];
    return Array.isArray(list) ? list : [];
  }, [data]);

  const filtered = useMemo(() => {
    const search = normalize(filters.search);
    const status = normalize(filters.status);

    return reservations.filter((r) => {
      const rStatus = normalize(r.status);
      if (status && rStatus !== status) return false;

      if (search) {
        const userId = r?.user?.id ?? r?.user_id ?? "";
        const userName = r?.user?.name ?? "";
        const userEmail = r?.user?.email ?? "";

        const typeName = r?.pet_type?.name ?? "";
        const breedName = r?.pet_breed?.name ?? ""; 
        const breedId = r?.pet_breed_id ?? "";

        const hay = [
          r?.id,
          userId,
          `user ${userId}`,     
          userName,
          userEmail,
          r?.pet_type_id,
          typeName,              
          breedId,
          breedName,            
          r?.status,
          r?.start_at,
          r?.end_at,
          r?.total,
        ]
          .filter((x) => x !== null && x !== undefined && String(x).trim() !== "")
          .join(" ")
          .toLowerCase();

        if (!hay.includes(search)) return false;
      }

      return true;
    });
  }, [reservations, filters.search, filters.status]);

  // sort
  const sorted = useMemo(() => {
    const sortKey = filters.sort || "newest";
    const arr = [...filtered];

    arr.sort((a, b) => {
      if (sortKey === "newest") return safeTime(b.created_at) - safeTime(a.created_at);
      if (sortKey === "oldest") return safeTime(a.created_at) - safeTime(b.created_at);
      return 0;
    });

    return arr;
  }, [filtered, filters.sort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // pagination
  const totalPages = sorted.length === 0 ? 1 : Math.ceil(sorted.length / PAGE_SIZE);
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, safePage]);

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(clamped);
  };

  // stats
  const stats = useMemo(() => {
    const total = filtered.length;
    const count = (s) => filtered.filter((r) => normalize(r.status) === s).length;

    return {
      total,
      pending: count("pending"),
      confirmed: count("confirmed"),
      rejected: count("rejected"),
      completed: count("completed"),
      cancelled: count("cancelled"),
    };
  }, [filtered]);

  const handleView = (r) => navigate(`/dashboard/boarding-management/bookings/${r.id}`);

  const runUpdate = async (id, status, successMsg) => {
    try {
      setBusyId(id);
      await updateStatus({ id, status }).unwrap();
      toast.success(successMsg);
    } catch (e) {
      console.error(e);
      toast.error(e?.data?.message || "Failed to update status.");
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirm = (r) => runUpdate(r.id, "confirmed", `Reservation #${r.id} confirmed.`);
  const handleReject = (r) => runUpdate(r.id, "rejected", `Reservation #${r.id} rejected.`);
  const handleComplete = (r) => runUpdate(r.id, "completed", `Reservation #${r.id} completed.`);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Temporary Bookings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage boarding reservations.</p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => refetch()}
          className="text-xs"
          disabled={isFetching}
        >
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
      <BoardingReservationsStats stats={stats} />

      {/* Filters */}
      <BoardingReservationFilters
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
            <CardTitle className="text-lg font-semibold text-slate-900">
              Reservations
            </CardTitle>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {filtered.length} reservations
            </span>
          </div>
        </CardHeader>

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
            <p className="text-center text-slate-500 py-8">Loading reservations...</p>
          ) : isError ? (
            <p className="text-center text-red-500 py-8">Failed to load reservations.</p>
          ) : (
            <>
              <BoardingReservationTable
                reservations={paginated}
                onView={handleView}
                onConfirm={handleConfirm}
                onReject={handleReject}
                onComplete={handleComplete}
                busyId={busyId}
                isUpdating={isUpdating}
              />

              {/* Pagination */}
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
    </div>
  );
}
