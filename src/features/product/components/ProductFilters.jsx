// src/features/product/components/ProductFilters.jsx
import React from "react";
import { Filter, X } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

const ProductFilters = ({
  filters,
  onChange,
  onReset,
  categories = [],
}) => {
  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.stockStatus ||
    filters.priceMin ||
    filters.priceMax ||
    (filters.isActive !== "" && filters.isActive != null);

  const handleFieldChange = (key, value) => {
    onChange((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const removeFilter = (key) => {
    onChange((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  return (
    <Card className="shadow-sm border border-slate-100">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">
              Filters
            </CardTitle>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Badge variant="secondary">
              {[
                filters.search,
                filters.category,
                filters.stockStatus,
                filters.priceMin,
                filters.priceMax,
                filters.isActive !== "" && filters.isActive != null
                  ? "isActive"
                  : null,
              ].filter(Boolean).length}{" "}
              active
            </Badge>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-red-500 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* كل الفلاتر على نفس السطر */}
        <div className="flex flex-wrap md:flex-nowrap items-end gap-4">
          {/* Search */}
          <div className="flex flex-col gap-1 w-full md:w-auto min-w-[180px]">
            <Label className="text-sm">Search</Label>
            <Input
              className="h-9 text-sm"
              placeholder="Search by name or description..."
              value={filters.search}
              onChange={(e) =>
                handleFieldChange("search", e.target.value)
              }
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1 w-full md:w-auto min-w-[180px]">
            <Label className="text-sm">Category</Label>
            <select
              value={filters.category}
              onChange={(e) =>
                handleFieldChange("category", e.target.value)
              }
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock status */}
          <div className="flex flex-col gap-1 w-full md:w-auto min-w-[180px]">
            <Label className="text-sm">Stock status</Label>
            <select
              value={filters.stockStatus}
              onChange={(e) =>
                handleFieldChange("stockStatus", e.target.value)
              }
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="in-stock">In stock (&gt; 0)</option>
              <option value="low-stock">Low stock (1–10)</option>
              <option value="out-of-stock">
                Out of stock (0)
              </option>
            </select>
          </div>

          {/* Is Active */}
          <div className="flex flex-col gap-1 w-full md:w-auto min-w-[160px]">
            <Label className="text-sm">Is active</Label>
            <select
              value={filters.isActive ?? ""} // "" | "1" | "0"
              onChange={(e) =>
                handleFieldChange("isActive", e.target.value)
              }
              className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>

          {/* Min price */}
          <div className="flex flex-col gap-1 w-full md:w-auto min-w-[160px]">
            <Label className="text-sm">Min price</Label>
            <Input
              className="h-9 text-sm"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 10"
              value={filters.priceMin}
              onChange={(e) =>
                handleFieldChange("priceMin", e.target.value)
              }
            />
          </div>

          {/* Max price */}
          <div className="flex flex-col gap-1 w-full md:w-auto min-w-[160px]">
            <Label className="text-sm">Max price</Label>
            <Input
              className="h-9 text-sm"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 100"
              value={filters.priceMax}
              onChange={(e) =>
                handleFieldChange("priceMax", e.target.value)
              }
            />
          </div>
        </div>

        {/* Badges للفلاتر الفعّالة */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {filters.search && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1"
              >
                Search: {filters.search}
                <button
                  type="button"
                  onClick={() => removeFilter("search")}
                  className="ml-1"
                >
                  ×
                </button>
              </Badge>
            )}

            {filters.category && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1"
              >
                Category: {filters.category}
                <button
                  type="button"
                  onClick={() => removeFilter("category")}
                  className="ml-1"
                >
                  ×
                </button>
              </Badge>
            )}

            {filters.stockStatus && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1"
              >
                Stock:{" "}
                {filters.stockStatus === "in-stock"
                  ? "In stock"
                  : filters.stockStatus === "low-stock"
                  ? "Low stock"
                  : "Out of stock"}
                <button
                  type="button"
                  onClick={() =>
                    removeFilter("stockStatus")
                  }
                  className="ml-1"
                >
                  ×
                </button>
              </Badge>
            )}

            {filters.isActive !== "" &&
              filters.isActive != null && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  Status:{" "}
                  {filters.isActive === "1" ? "Active" : "Inactive"}
                  <button
                    type="button"
                    onClick={() => removeFilter("isActive")}
                    className="ml-1"
                  >
                    ×
                  </button>
                </Badge>
              )}

            {filters.priceMin && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1"
              >
                Min: {filters.priceMin}
                <button
                  type="button"
                  onClick={() => removeFilter("priceMin")}
                  className="ml-1"
                >
                  ×
                </button>
              </Badge>
            )}

            {filters.priceMax && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1"
              >
                Max: {filters.priceMax}
                <button
                  type="button"
                  onClick={() => removeFilter("priceMax")}
                  className="ml-1"
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
};

export default ProductFilters;
