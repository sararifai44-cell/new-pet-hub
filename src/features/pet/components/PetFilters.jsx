import React, { useState } from "react";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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

  const hasActiveFilters =
    filters.search ||
    filters.type ||
    filters.breed ||
    filters.status ||
    filters.gender;

  const removeFilter = (filterKey) => {
    onFilterChange({ ...filters, [filterKey]: "" });
  };

  const getTypeName = (typeId) => {
    return (
      petTypes.find((type) => type.type_id == typeId)?.name || typeId
    );
  };

  const getBreedName = (breedId) => {
    return (
      breeds.find((breed) => breed.breed_id == breedId)?.name ||
      breedId
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter size={20} />
          Filters
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
                placeholder="Search by name, breed, or owner..."
                value={filters.search || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {showTypeFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pet Type
            </label>
            <select
              value={filters.type || ""}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Breed
            </label>
            <select
              value={filters.breed || ""}
              onChange={(e) => handleBreedChange(e.target.value)}
              disabled={!filters.type}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">All Breeds</option>
              {breeds
                .filter(
                  (breed) =>
                    !filters.type ||
                    breed.type_id === parseInt(filters.type)
                )
                .map((breed) => (
                  <option
                    key={breed.breed_id}
                    value={breed.breed_id}
                  >
                    {breed.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {showStatusFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status || ""}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="not-available">Not Available</option>
            </select>
          </div>
        )}
      </div>

      {showAdvanced && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">
            Additional filtering options
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={filters.gender || ""}
                onChange={(e) =>
                  handleGenderChange(e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>
      )}

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
          {filters.type && (
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-50 border-green-200 text-green-800"
            >
              Type: {getTypeName(filters.type)}
              <button
                onClick={() => removeFilter("type")}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.breed && (
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-50 border-purple-200 text-purple-800"
            >
              Breed: {getBreedName(filters.breed)}
              <button
                onClick={() => removeFilter("breed")}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-orange-50 border-orange-200 text-orange-800"
            >
              Status:{" "}
              {filters.status === "available"
                ? "Available"
                : "Not Available"}
              <button
                onClick={() => removeFilter("status")}
                className="ml-1 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.gender && (
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-pink-50 border-pink-200 text-pink-800"
            >
              Gender: {filters.gender}
              <button
                onClick={() => removeFilter("gender")}
                className="ml-1 text-pink-600 hover:text-pink-800"
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

export default PetFilters;
