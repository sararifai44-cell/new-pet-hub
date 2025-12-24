// src/features/pet/components/PetTable.jsx
import React from "react";
import { Edit3, Trash2, Eye, Image as ImageIcon } from "lucide-react";

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

const pickImageUrl = (pet) => {
  if (pet?.cover_image) return pet.cover_image;

  const arr = Array.isArray(pet?.images) ? pet.images : [];
  const first = arr[0];
  if (!first) return "";

  if (typeof first === "string") return first;
  if (typeof first === "object") return first.url || first.original_url || "";
  return "";
};

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return "-";
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return "-";

  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) years--;
  return years >= 0 ? years : "-";
};

const PetTable = ({ pets, onView, onEdit, onDelete, showActions = true }) => {
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
          {pets.map((pet) => {
            const imgUrl = pickImageUrl(pet);

            const typeName =
              pet?.pet_type?.name ??
              pet?.type?.name ??
              pet?.breed?.type?.name ??
              "-";

            const breedName =
              pet?.pet_breed?.name ?? pet?.breed?.name ?? "-";

            return (
              <TableRow
                key={pet?.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={pet?.name || "pet"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-gray-400">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {pet?.name}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {pet?.gender?.toLowerCase?.() || "-"} •{" "}
                        {calculateAge(pet?.date_of_birth)} years
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm font-medium text-gray-900">
                    {typeName}
                  </div>
                  <div className="text-xs text-gray-500">{breedName}</div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      pet?.is_adoptable
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-gray-50 border-gray-200 text-gray-800"
                    }
                  >
                    {pet?.is_adoptable ? "Available" : "Not Available"}
                  </Badge>
                </TableCell>

                {showActions && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onView?.(pet)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit?.(pet)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        title="Edit Pet"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete?.(pet)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete Pet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PetTable;
