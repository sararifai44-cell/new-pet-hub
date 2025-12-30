import React from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function BoardingServiceFilters({ filters, onChange, onReset }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
        <div>
          <label className="block text-xs text-neutral-500 mb-1">
            Search 
          </label>
          <Input
            value={filters.q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="e.g. Grooming"
          />
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1">Active</label>
          <select
            value={filters.active}
            onChange={(e) => onChange({ active: e.target.value })}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All</option>
            <option value="1">Active only</option>
            <option value="0">Inactive only</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1">
            Max Price (optional)
          </label>
          <Input
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            placeholder="e.g. 20"
          />
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
