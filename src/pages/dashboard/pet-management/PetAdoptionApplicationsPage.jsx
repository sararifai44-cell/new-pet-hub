import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import { useGetAdoptionApplicationsByPetIdQuery } from "../../../features/adoptionApplications/petAdoptionApplicationsApiSlice";

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

export default function PetAdoptionApplicationsPage() {
  const { id } = useParams(); // هذا petId من الراوت
  const navigate = useNavigate();

  const { data, isLoading, isError, isFetching, refetch } =
    useGetAdoptionApplicationsByPetIdQuery(id);

  const applications = useMemo(() => {
    const list = data?.data ?? data ?? [];
    return Array.isArray(list) ? list : [];
  }, [data]);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Pet Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Showing adoption applications for Pet ID:{" "}
            <span className="font-medium text-slate-700">{id}</span>
          </p>
        </div>

        {/* ✅ Actions (Back + Refresh) */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/pet-management")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pets
          </Button>

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
      </div>

      {/* Table */}
      <Card className="shadow-sm border border-slate-100 bg-white relative">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Applications
            </CardTitle>

            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {applications.length} applications
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
            <p className="text-center text-slate-500 py-8">
              Loading applications...
            </p>
          ) : isError ? (
            <p className="text-center text-red-500 py-8">
              Failed to load applications.
            </p>
          ) : applications.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              No applications found for this pet.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-xs font-semibold text-slate-600 uppercase">
                      ID
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 uppercase">
                      User
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 uppercase">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 uppercase">
                      Created
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-600 uppercase">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {applications.map((a) => {
                    const st = normalize(a.status);
                    const isApproved = st === "approved" || st === "accepted";
                    const isRejected = st === "rejected";

                    return (
                      <TableRow
                        key={a.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="font-medium text-slate-900">
                          {a.id}
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">
                              {a?.user?.name ?? "—"}
                            </span>
                            <span className="text-xs text-slate-500">
                              {a?.user?.email ?? "—"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              isApproved
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                : isRejected
                                ? "bg-red-50 border-red-200 text-red-800"
                                : "bg-amber-50 border-amber-200 text-amber-800"
                            }
                          >
                            {prettyStatus(a.status)}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-slate-700">
                          {formatDate(a.created_at)}
                        </TableCell>

                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate(`/dashboard/adoption-center/${a.id}`)
                            }
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
