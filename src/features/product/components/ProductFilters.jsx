// src/features/product/components/ProductFilters.jsx

import React, { useState } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Package,
  CheckCircle2,
} from "lucide-react";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

const ProductFilters = ({
  filters,
  onFilterChange,
  onReset,
  categories = [],
  showSearch = true,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (value) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleCategoryChange = (categoryId) => {
    onFilterChange({ ...filters, category: categoryId });
  };

  const handleActiveChange = (status) => {
    onFilterChange({ ...filters, is_active: status });
  };

  const handleStockChange = (stock) => {
    onFilterChange({ ...filters, stock });
  };

  const handleMinPriceChange = (value) => {
    onFilterChange({ ...filters, minPrice: value });
  };

  const handleMaxPriceChange = (value) => {
    onFilterChange({ ...filters, maxPrice: value });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.is_active ||
    filters.stock ||
    filters.minPrice ||
    filters.maxPrice;

  const removeFilter = (filterKey) => {
    onFilterChange({ ...filters, [filterKey]: "" });
  };

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id == id);
    if (!cat) return id;
    return cat.name_en || cat.name || cat.name_ar || id;
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      {/* Header */}
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
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            {showAdvanced ? "Hide Options" : "More Options"}
            {showAdvanced ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
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

      {/* Basic Filters */}
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
                placeholder="Search by name or description..."
                value={filters.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category || ""}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name_en || cat.name || cat.name_ar}
              </option>
            ))}
          </select>
        </div>

        {/* Active Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Active Status
          </label>
          <select
            value={filters.is_active || ""}
            onChange={(e) => handleActiveChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Stock Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock
          </label>
          <select
            value={filters.stock || ""}
            onChange={(e) => handleStockChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All</option>
            <option value="in-stock">In stock</option>
            <option value="out-of-stock">Out of stock</option>
          </select>
        </div>
      </div>

      {/* Advanced */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3 flex items-center gap-1.5">
            <DollarSign size={14} className="text-gray-500" />
            Price range
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={filters.minPrice || ""}
                onChange={(e) => handleMinPriceChange(e.target.value)}
                placeholder="e.g. 5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={filters.maxPrice || ""}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                placeholder="e.g. 50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
          {filters.search && (
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs"
            >
              Search: {filters.search}
              <button
                onClick={() => removeFilter("search")}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </Badge>
          )}

          {filters.category && (
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-indigo-50 border-indigo-200 text-indigo-800"
            >
              Category: {getCategoryName(filters.category)}
              <button
                onClick={() => removeFilter("category")}
                className="ml-1 text-indigo-600 hover:text-indigo-800"
              >
                ×
              </button>
            </Badge>
          )}

          {filters.is_active && (
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 border-green-200 text-green-800"
            >
              <CheckCircle2 className="w-3 h-3" />
              {filters.is_active === "active"
                ? "Active only"
                : "Inactive"}
              <button
                onClick={() => removeFilter("is_active")}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </Badge>
          )}

          {filters.stock && (
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-amber-50 border-amber-200 text-amber-800"
            >
              <Package className="w-3 h-3" />
              {filters.stock === "in-stock"
                ? "In stock"
                : "Out of stock"}
              <button
                onClick={() => removeFilter("stock")}
                className="ml-1 text-amber-600 hover:text-amber-800"
              >
                ×
              </button>
            </Badge>
          )}

          {filters.minPrice && (
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs"
            >
              Min Price: {filters.minPrice}
              <button
                onClick={() => removeFilter("minPrice")}
                className="ml-1 text-gray-600 hover:text-gray-800"
              >
                ×
              </button>
            </Badge>
          )}

          {filters.maxPrice && (
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs"
            >
              Max Price: {filters.maxPrice}
              <button
                onClick={() => removeFilter("maxPrice")}
                className="ml-1 text-gray-600 hover:text-gray-800"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
