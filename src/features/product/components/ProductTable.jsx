// src/features/product/components/ProductTable.jsx
import React from "react";
import { Eye, Pencil, Trash2, Image as ImageIcon } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

const getThumb = (p) => {
  return (
    p?.cover_image ||
    (Array.isArray(p?.images) ? p.images?.[0]?.url : null) ||
    null
  );
};

export default function ProductTable({ products = [], onView, onEdit, onDelete }) {
  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-[70px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Pet Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right w-[160px]">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((p) => {
            const thumb = getThumb(p);
            const goDetails = () => onView?.(p);

            return (
              <TableRow
                key={p.id}
                onClick={goDetails}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") goDetails();
                }}
                className="hover:bg-slate-50/60 cursor-pointer transition-colors"
              >
                <TableCell>
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={p.name_en || p.name || "product"}
                      className="h-10 w-10 rounded-md object-cover border border-slate-200"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md border border-slate-200 bg-slate-50 grid place-items-center">
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </TableCell>

                <TableCell className="font-medium text-slate-900">
                  {p.name_en || p.name || "-"}
                </TableCell>

                <TableCell>{p.pet_type?.name || "-"}</TableCell>
                <TableCell>{p.category?.name_en || p.category?.name || "-"}</TableCell>

                <TableCell>${Number(p.price || 0).toFixed(2)}</TableCell>

                <TableCell>{Number(p.stock_quantity ?? 0)}</TableCell>

                <TableCell>
                  {p.is_active ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-500">
                      Inactive
                    </Badge>
                  )}
                </TableCell>

                {/* ✅ Actions: ما تعمل navigation */}
                <TableCell className="text-right" onClick={stop}>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        stop(e);
                        onView?.(p);
                      }}
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        stop(e);
                        onEdit?.(p);
                      }}
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        stop(e);
                        onDelete?.(p);
                      }}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
