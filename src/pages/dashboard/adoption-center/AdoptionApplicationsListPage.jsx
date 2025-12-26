import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

import ConfirmDeleteDialog from "../../../components/ui/confirm-delete-dialog";

import AdoptionApplicationsStats from "../../../features/adoptionApplications/components/AdoptionApplicationsStats";
import AdoptionApplicationsFilters from "../../../features/adoptionApplications/components/AdoptionApplicationsFilters";
import AdoptionApplicationsTable from "../../../features/adoptionApplications/components/AdoptionApplicationsTable";

import {
  useGetAdoptionApplicationsQuery,
  useUpdateAdoptionApplicationStatusMutation,
  useDeleteAdoptionApplicationMutation,
} from "../../../features/adoptionApplications/adoptionApplicationsApiSlice";

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

export default function AdoptionApplicationsListPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
    toast.info("Filters reset.");
  };

  const { data, isLoading, isError, isFetching, refetch } =
    useGetAdoptionApplicationsQuery();

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateAdoptionApplicationStatusMutation();

  const [deleteApp, { isLoading: isDeleting }] =
    useDeleteAdoptionApplicationMutation();

  const applications = useMemo(() => {
    const list = data?.data ?? data ?? [];
    return Array.isArray(list) ? list : [];
  }, [data]);

  // filter
  const filtered = useMemo(() => {
    const search = normalize(filters.search);
    const status = normalize(filters.status);

    return applications.filter((a) => {
      const aStatus = normalize(a.status);
      if (status && aStatus !== status) return false;

      if (search) {
        const hay = [
          a.id,
          a.pet_id,
          a.user_id,
          a.pet?.name,
          a.user?.name,
          a.user?.email,
          a.status,
        ]
          .filter((x) => x !== null && x !== undefined)
          .join(" ")
          .toLowerCase();

        if (!hay.includes(search)) return false;
      }

      return true;
    });
  }, [applications, filters.search, filters.status]);

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
    const count = (s) => filtered.filter((a) => normalize(a.status) === s).length;

    return {
      total,
      pending: count("pending"),
      approved: count("approved") + count("accepted"),
      rejected: count("rejected"),
    };
  }, [filtered]);

  const handleView = (app) => navigate(`/dashboard/adoption-center/${app.id}`);

  const APPROVE_VALUE = "approved";

  const handleApprove = async (app) => {
    try {
      await updateStatus({ id: app.id, status: APPROVE_VALUE }).unwrap();
      toast.success(`Application #${app.id} approved.`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status.");
    }
  };

  const handleReject = async (app) => {
    try {
      await updateStatus({ id: app.id, status: "rejected" }).unwrap();
      toast.success(`Application #${app.id} rejected.`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status.");
    }
  };

  // Delete Dialog
  const [appToDelete, setAppToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const openDeleteDialog = (app) => {
    setAppToDelete(app);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setIsDeleteDialogOpen(false);
    setAppToDelete(null);
  };

  const confirmDelete = async () => {
    if (!appToDelete?.id) return;

    try {
      await deleteApp(appToDelete.id).unwrap();
      toast.success(`Application #${appToDelete.id} deleted.`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete application.");
    } finally {
      setIsDeleteDialogOpen(false);
      setAppToDelete(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Adoption Center</h1>
          <p className="text-sm text-slate-500 mt-1">Manage adoption applications.</p>
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
      <AdoptionApplicationsStats stats={stats} />

      {/* Filters */}
      <AdoptionApplicationsFilters
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
              Applications
            </CardTitle>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {filtered.length} applications
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
            <p className="text-center text-slate-500 py-8">Loading applications...</p>
          ) : isError ? (
            <p className="text-center text-red-500 py-8">Failed to load applications.</p>
          ) : (
            <>
              <AdoptionApplicationsTable
                applications={paginated}
                onView={handleView}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={openDeleteDialog}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
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

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDeleteDialog();
          else setIsDeleteDialogOpen(open);
        }}
        entityLabel="application"
        name={appToDelete?.id ? `#${appToDelete.id}` : ""}
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
