import React from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function BoardingReservationFilters({
  filters,
  onFilterChange,
  onReset,
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
        <div>
          <label className="block text-xs text-neutral-500 mb-1">
            Search (ID / User name / email / Type)
          </label>
          <Input
            value={filters.search}
            onChange={(e) =>
              onFilterChange((p) => ({ ...p, search: e.target.value }))
            }
            placeholder='e.g."User" or user4@example.com or Dog'
          />
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange((p) => ({ ...p, status: e.target.value }))
            }
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1">Sort</label>
          <select
            value={filters.sort}
            onChange={(e) =>
              onFilterChange((p) => ({ ...p, sort: e.target.value }))
            }
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
