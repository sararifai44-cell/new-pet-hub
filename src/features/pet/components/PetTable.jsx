import React from "react";
import { Edit3, Trash2, Eye } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

import { defaultPetImages } from "../../../lib/mockData";

const PetTable = ({
  pets,
  onView,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const getDefaultImage = (typeName) => {
    if (!typeName) return defaultPetImages.cat;
    const key = typeName.toLowerCase();
    return defaultPetImages[key] || defaultPetImages.cat;
  };

  const getPetImage = (pet) => {
    return pet.images && pet.images.length > 0
      ? pet.images[0]
      : getDefaultImage(pet.breed?.type?.name);
  };

  const calculateAge = (dateOfBirth) => {
    return (
      new Date().getFullYear() -
      new Date(dateOfBirth).getFullYear()
    );
  };

  if (!pets || pets.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg">
        No pets found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-xs font-semibold text-gray-600 uppercase">
              Pet
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-600 uppercase">
              Type &amp; Breed
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-600 uppercase">
              Owner
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-600 uppercase">
              Status
            </TableHead>
            {showActions && (
              <TableHead className="text-xs font-semibold text-gray-600 uppercase">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {pets.map((pet) => (
            <TableRow
              key={pet.pet_id}
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell>
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={getPetImage(pet)}
                      alt={pet.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {pet.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {pet.gender.toLowerCase()} •{" "}
                      {calculateAge(pet.date_of_birth)} years
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="text-sm font-medium text-gray-900">
                  {pet.breed?.type?.name}
                </div>
                <div className="text-xs text-gray-500">
                  {pet.breed?.name}
                </div>
              </TableCell>

              <TableCell>
                <div className="text-sm font-medium text-gray-900">
                  {pet.owner?.full_name || "Center"}
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    pet.is_adoptable
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-gray-50 border-gray-200 text-gray-800"
                  }
                >
                  {pet.is_adoptable
                    ? "Available"
                    : "Not Available"}
                </Badge>
              </TableCell>

              {showActions && (
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(pet)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(pet)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      title="Edit Pet"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(pet)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete Pet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PetTable;
