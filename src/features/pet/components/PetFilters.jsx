// src/features/pet/components/PetFilters.jsx
import React, { useMemo, useState } from "react";
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

const PetFilters = ({
  filters,
  onFilterChange,
  onReset,
  petTypes = [],
  breeds = [],
  showSearch = true,
  showTypeFilter = true,
  showStatusFilter = true,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = Boolean(
    filters?.search ||
      filters?.type ||
      filters?.breed ||
      filters?.status ||
      filters?.gender
  );

  const activeCount = useMemo(
    () => Object.values(filters || {}).filter(Boolean).length,
    [filters]
  );

  const handleSearchChange = (value) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleTypeChange = (typeId) => {
    onFilterChange({ ...filters, type: typeId, breed: "" });
  };

  const handleBreedChange = (breedId) => {
    onFilterChange({ ...filters, breed: breedId });
  };

  const handleStatusChange = (status) => {
    onFilterChange({ ...filters, status });
  };

  const handleGenderChange = (gender) => {
    onFilterChange({ ...filters, gender });
  };

  const removeFilter = (filterKey) => {
    if (filterKey === "type") {
      onFilterChange({ ...filters, type: "", breed: "" });
      return;
    }
    onFilterChange({ ...filters, [filterKey]: "" });
  };

  const getTypeName = (typeId) =>
    petTypes.find((t) => String(t.type_id) === String(typeId))?.name || typeId;

  const getBreedName = (breedId) =>
    breeds.find((b) => String(b.breed_id) === String(breedId))?.name || breedId;

  const filteredBreeds = useMemo(() => {
    if (!filters?.type) return breeds;
    return breeds.filter(
      (b) => Number(b.type_id) === Number(filters.type)
    );
  }, [breeds, filters?.type]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="p-4 md:p-5 flex items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
            <Filter className="w-4 h-4 text-slate-700" />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-semibold text-slate-900">
              Filters
            </h3>

            {hasActiveFilters && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                {activeCount} active
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
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
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Main filters */}
      <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {showSearch && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search by name, type, breed..."
                value={filters?.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {showTypeFilter && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Pet Type
            </label>
            <select
              value={filters?.type || ""}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
            >
              <option value="">All Types</option>
              {petTypes.map((type) => (
                <option key={type.type_id} value={type.type_id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {showTypeFilter && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Breed
            </label>
            <select
              value={filters?.breed || ""}
              onChange={(e) => handleBreedChange(e.target.value)}
              disabled={!filters?.type}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300
                         disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">All Breeds</option>
              {filteredBreeds.map((breed) => (
                <option key={breed.breed_id} value={breed.breed_id}>
                  {breed.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {showStatusFilter && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              value={filters?.status || ""}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="not-available">Not Available</option>
            </select>
          </div>
        )}
      </div>

      {/* Advanced */}
      {showAdvanced && (
        <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0 border-t border-slate-100">
          <div className="pt-4">
            <p className="text-sm text-slate-500 mb-3">
              Additional filtering options
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Gender
                </label>
                <select
                  value={filters?.gender || ""}
                  onChange={(e) => handleGenderChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300"
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active badges */}
      {hasActiveFilters && (
        <div className="px-4 md:px-5 pb-4 md:pb-5">
          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
            {filters?.search && (
              <Badge variant="outline" className="inline-flex items-center gap-1 px-2 py-1 text-xs">
                Search: {filters.search}
                <button
                  type="button"
                  onClick={() => removeFilter("search")}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </Badge>
            )}

            {filters?.type && (
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 border-green-200 text-green-800"
              >
                Type: {getTypeName(filters.type)}
                <button
                  type="button"
                  onClick={() => removeFilter("type")}
                  className="ml-1 text-green-700 hover:text-green-900"
                >
                  ×
                </button>
              </Badge>
            )}

            {filters?.breed && (
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-50 border-purple-200 text-purple-800"
              >
                Breed: {getBreedName(filters.breed)}
                <button
                  type="button"
                  onClick={() => removeFilter("breed")}
                  className="ml-1 text-purple-700 hover:text-purple-900"
                >
                  ×
                </button>
              </Badge>
            )}

            {filters?.status && (
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-orange-50 border-orange-200 text-orange-800"
              >
                Status: {filters.status === "available" ? "Available" : "Not Available"}
                <button
                  type="button"
                  onClick={() => removeFilter("status")}
                  className="ml-1 text-orange-700 hover:text-orange-900"
                >
                  ×
                </button>
              </Badge>
            )}

            {filters?.gender && (
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-pink-50 border-pink-200 text-pink-800"
              >
                Gender: {filters.gender}
                <button
                  type="button"
                  onClick={() => removeFilter("gender")}
                  className="ml-1 text-pink-700 hover:text-pink-900"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PetFilters;
