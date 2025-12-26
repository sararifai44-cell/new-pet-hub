// src/features/product/components/ProductFilters.jsx
import React, { useState } from "react";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

export default function ProductFilters({
  filters,
  onFilterChange,
  onReset,
  categories = [],
  petTypes = [],
  showSearch = true,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.pet_type ||
    filters.is_active ||
    filters.stock;

  const removeFilter = (filterKey) => {
    onFilterChange({ ...filters, [filterKey]: "" });
  };

  const getCategoryName = (id) => {
    const cat = categories.find((c) => String(c.id) === String(id));
    return cat?.name_en || cat?.name || cat?.name_ar || id;
  };

  const getPetTypeName = (id) => {
    const t = petTypes.find((x) => String(x.id) === String(id));
    return t?.name || t?.name_en || t?.name_ar || id;
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter size={20} />
          Product Filters
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {Object.values(filters).filter(Boolean).length} active
            </span>
          )}
        </h3>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            {showAdvanced ? "Hide Options" : "More Options"}
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X size={16} />
              Reset All
            </Button>
          )}
        </div>
      </div>

      {/* Basic filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {showSearch && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search by name, category..."
                value={filters.search || ""}
                onChange={(e) =>
                  onFilterChange({ ...filters, search: e.target.value })
                }
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* ✅ Pet Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pet Type
          </label>
          <select
            value={filters.pet_type || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, pet_type: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Pet Types</option>
            {petTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name || t.name_en || t.name_ar}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, category: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_en || c.name || c.name_ar}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.is_active || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, is_active: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Advanced */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Additional options</p>

          {/* Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <select
                value={filters.stock || ""}
                onChange={(e) =>
                  onFilterChange({ ...filters, stock: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="in-stock">In stock</option>
                <option value="out-of-stock">Out of stock</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
          {filters.search && (
            <Badge variant="outline" className="inline-flex items-center gap-1 px-2 py-1 text-xs">
              Search: {filters.search}
              <button onClick={() => removeFilter("search")} className="ml-1 text-blue-600">×</button>
            </Badge>
          )}

          {filters.pet_type && (
            <Badge variant="outline" className="inline-flex items-center gap-1 px-2 py-1 text-xs">
              Pet Type: {getPetTypeName(filters.pet_type)}
              <button onClick={() => removeFilter("pet_type")} className="ml-1 text-blue-600">×</button>
            </Badge>
          )}

          {filters.category && (
            <Badge variant="outline" className="inline-flex items-center gap-1 px-2 py-1 text-xs">
              Category: {getCategoryName(filters.category)}
              <button onClick={() => removeFilter("category")} className="ml-1 text-blue-600">×</button>
            </Badge>
          )}

          {filters.is_active && (
            <Badge variant="outline" className="inline-flex items-center gap-1 px-2 py-1 text-xs">
              Status: {filters.is_active}
              <button onClick={() => removeFilter("is_active")} className="ml-1 text-blue-600">×</button>
            </Badge>
          )}

          {filters.stock && (
            <Badge variant="outline" className="inline-flex items-center gap-1 px-2 py-1 text-xs">
              Stock: {filters.stock}
              <button onClick={() => removeFilter("stock")} className="ml-1 text-blue-600">×</button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
