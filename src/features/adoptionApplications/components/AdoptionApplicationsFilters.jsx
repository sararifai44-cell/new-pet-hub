import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function AdoptionApplicationsFilters({
  filters,
  onFilterChange,
  onReset,
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Filters</CardTitle>
          <Button variant="outline" size="sm" onClick={onReset}>
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Search</label>
            <Input
              value={filters.search}
              onChange={(e) => onFilterChange((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Pet, user, email, motivation, id..."
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Status</label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange((prev) => ({ ...prev, status: e.target.value }))}
              className="mt-1 w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600">Sort</label>
            <select
              value={filters.sort}
              onChange={(e) => onFilterChange((prev) => ({ ...prev, sort: e.target.value }))}
              className="mt-1 w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
