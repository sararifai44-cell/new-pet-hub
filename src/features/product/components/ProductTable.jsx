// src/features/product/components/ProductTable.jsx
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

const ProductTable = ({
  products,
  onView,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg">
        No products found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-xs font-semibold text-gray-600 uppercase">
              Product
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-600 uppercase">
              Category
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-600 uppercase">
              Price
            </TableHead>
            <TableHead className="text-xs font-semibold text-gray-600 uppercase">
              Stock
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
          {products.map((product) => (
            <TableRow
              key={product.id}
              className="hover:bg-gray-50 transition-colors"
            >
              {/* Product names */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    {product.name_en || product.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.name_ar}
                  </span>
                </div>
              </TableCell>

              {/* Category */}
              <TableCell>
                <div className="text-sm text-gray-900">
                  {product.category?.name_en || "-"}
                </div>
                <div className="text-xs text-gray-500">
                  {product.category?.name_ar}
                </div>
              </TableCell>

              {/* Price */}
              <TableCell>
                <span className="text-sm text-gray-900">
                  {product.price} $
                </span>
              </TableCell>

              {/* Stock */}
              <TableCell>
                <span
                  className={
                    product.stock <= 0
                      ? "text-sm text-red-600 font-medium"
                      : "text-sm text-gray-900"
                  }
                >
                  {product.stock}
                </span>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    product.is_active
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-gray-50 border-gray-200 text-gray-700"
                  }
                >
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              {/* Actions */}
              {showActions && (
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(product)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(product)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      title="Edit Product"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(product)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete Product"
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

export default ProductTable;
