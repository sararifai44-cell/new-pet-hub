import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";

function BreedIndexBadge({ n }) {
  return (
    <div className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 grid place-items-center flex-shrink-0">
      <span className="text-slate-700 font-medium text-sm">{n}</span>
    </div>
  );
}

export default function BreedsPanel({
  selectedType,
  selectedTypeName,
  filteredBreeds,
  breedSearch,
  setBreedSearch,
  onOpenCreateBreed,
  onOpenEditBreed,
  onDeleteBreed,
  isCreatingBreed,
  isDeletingBreed,
}) {
  if (!selectedType) {
    return (
      <Card className="h-full flex items-center justify-center border-slate-200 shadow-sm">
        <CardContent>
          <p className="text-slate-500">Select a pet type on the left to view its breeds.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white border border-slate-200 p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div className="min-w-0 space-y-1">
          <h2 className="text-xl font-semibold text-slate-900 truncate">
            {selectedTypeName} Breeds
          </h2>
          <p className="text-xs md:text-sm text-slate-500">{filteredBreeds.length} breeds available</p>
        </div>

        <Button
          className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 self-start md:self-auto"
          disabled={isCreatingBreed}
          onClick={onOpenCreateBreed}
        >
          <Plus className="w-4 h-4" />
          Add Breed
        </Button>
      </div>

      <div className="space-y-1">
        <Label>Search breeds</Label>
        <Input
          placeholder="Search breeds..."
          value={breedSearch}
          onChange={(e) => setBreedSearch(e.target.value)}
        />
      </div>

      {filteredBreeds.length === 0 ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="py-8 text-center text-slate-500">
            No breeds found for this type.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBreeds.map((breed, idx) => {
            const displayBreed = breed.name_en || breed.name || "-";

            return (
              <Card
                key={breed.breed_id}
                className="flex items-center justify-between px-4 py-3 shadow-sm border border-slate-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <BreedIndexBadge n={idx + 1} />

                  <div className="space-y-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate">{displayBreed}</div>
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-slate-50 border-slate-200">
                      {selectedTypeName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-600 hover:bg-slate-50"
                    onClick={() => onOpenEditBreed(breed)}
                    title="Edit breed"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => onDeleteBreed(breed)}
                    disabled={isDeletingBreed}
                    title="Delete breed"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
