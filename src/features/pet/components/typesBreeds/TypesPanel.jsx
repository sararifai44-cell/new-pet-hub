import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { Button } from "../../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";

const getInitial = (name) => {
  const s = String(name ?? "").trim();
  return s ? s[0].toUpperCase() : "?";
};

function TypeAvatar({ name }) {
  const initial = getInitial(name);
  return (
    <div className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 grid place-items-center flex-shrink-0">
      <span className="text-slate-700 font-medium">{initial}</span>
    </div>
  );
}

export default function TypesPanel({
  filteredTypes,
  types,
  selectedType,
  onSelectTypeId,
  typeSearch,
  setTypeSearch,
  onOpenCreateType,
  onOpenEditType,
  onDeleteType,
  isCreatingType,
  isDeletingType,
  getBreedsCountForType,
}) {
  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-slate-100">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-900">Pet Types</CardTitle>
          <p className="text-xs text-slate-500">Select a category</p>
        </div>

        <Button
          size="icon"
          className="rounded-full bg-indigo-600 hover:bg-indigo-700"
          disabled={isCreatingType}
          title="Add type"
          onClick={onOpenCreateType}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="space-y-1">
          <Label>Search Types</Label>
          <Input
            placeholder="Search..."
            value={typeSearch}
            onChange={(e) => setTypeSearch(e.target.value)}
          />
        </div>

        <div className="space-y-3 max-h-[480px] overflow-auto pr-1">
          {filteredTypes.length === 0 && <p className="text-sm text-gray-500">No types found.</p>}

          {filteredTypes.map((type) => {
            const isSelected = selectedType && type.type_id === selectedType.type_id;
            const count = getBreedsCountForType(types, type.type_id);
            const displayName = type.name_en || type.name || "-";

            return (
              <div
                key={type.type_id}
                onClick={() => onSelectTypeId(type.type_id)}
                className={[
                  "flex items-center justify-between rounded-2xl border p-3 cursor-pointer transition shadow-sm",
                  isSelected
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40",
                ].join(" ")}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <TypeAvatar name={displayName} />

                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-slate-900 truncate">{displayName}</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">{count} breeds</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-600 hover:bg-white/60"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEditType(type);
                    }}
                    title="Edit type"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDeletingType) onDeleteType(type);
                    }}
                    disabled={isDeletingType}
                    title="Delete type"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
