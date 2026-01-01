// src/features/order/components/OrderFilters.jsx
import React from "react";
import { Search, Filter, X } from "lucide-react";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";

const SORT_OPTIONS = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "total_desc", label: "Total: High → Low" },
  { key: "total_asc", label: "Total: Low → High" },
];

const pretty = (v) => String(v ?? "").replaceAll("_", " ");

export default function OrderFilters({ filters, onFilterChange, onReset }) {
  const setValue = (key, value) => onFilterChange({ ...filters, [key]: value });

  const hasSearch = !!(filters.search && String(filters.search).trim());
  const hasStatus = !!filters.status;
  const hasPayment = !!filters.payment_status;
  const hasSort = (filters.sort || "newest") !== "newest";

  const hasActiveFilters = hasSearch || hasStatus || hasPayment || hasSort;
  const activeCount = [hasSearch, hasStatus, hasPayment, hasSort].filter(Boolean).length;

  const removeFilter = (key) => {
    if (key === "sort") return onFilterChange({ ...filters, sort: "newest" });
    onFilterChange({ ...filters, [key]: "" });
  };

  const sortLabel =
    SORT_OPTIONS.find((o) => o.key === (filters.sort || "newest"))?.label || "Newest";

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">
                {activeCount} active
              </span>
            )}
          </h3>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Reset All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-5">
            <label className="text-xs font-medium text-slate-600">Search</label>
            <div className="relative mt-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={filters.search || ""}
                onChange={(e) => setValue("search", e.target.value)}
                placeholder="Order ID, User ID..."
                className="pl-9 h-10"
              />
            </div>
          </div>

          {/* Status */}
          <div className="lg:col-span-2">
            <label className="text-xs font-medium text-slate-600">Status</label>
            <select
              value={filters.status || ""}
              onChange={(e) => setValue("status", e.target.value)}
              className="mt-1 w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In progress</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment */}
          <div className="lg:col-span-2">
            <label className="text-xs font-medium text-slate-600">Payment</label>
            <select
              value={filters.payment_status || ""}
              onChange={(e) => setValue("payment_status", e.target.value)}
              className="mt-1 w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Sort */}
          <div className="lg:col-span-3">
            <label className="text-xs font-medium text-slate-600">Sort</label>
            <select
              value={filters.sort || "newest"}
              onChange={(e) => setValue("sort", e.target.value)}
              className="mt-1 w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200">
            {hasSearch && (
              <Badge variant="outline" className="inline-flex items-center gap-1 px-2 py-1 text-xs">
                Search: {String(filters.search).trim()}
                <button
                  type="button"
                  onClick={() => removeFilter("search")}
                  className="ml-1 text-slate-600 hover:text-slate-900"
                >
                  ×
                </button>
              </Badge>
            )}

            {hasStatus && (
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-amber-50 border-amber-200 text-amber-800"
              >
                Status: {pretty(filters.status)}
                <button
                  type="button"
                  onClick={() => removeFilter("status")}
                  className="ml-1 text-amber-700 hover:text-amber-900"
                >
                  ×
                </button>
              </Badge>
            )}

            {hasPayment && (
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-emerald-50 border-emerald-200 text-emerald-800"
              >
                Payment: {pretty(filters.payment_status)}
                <button
                  type="button"
                  onClick={() => removeFilter("payment_status")}
                  className="ml-1 text-emerald-700 hover:text-emerald-900"
                >
                  ×
                </button>
              </Badge>
            )}

            {hasSort && (
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-slate-50 border-slate-200 text-slate-700"
              >
                Sort: {sortLabel}
                <button
                  type="button"
                  onClick={() => removeFilter("sort")}
                  className="ml-1 text-slate-600 hover:text-slate-900"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
