// src/features/product/components/ProductTable.jsx

import React from "react";
import { Eye, Edit3, Trash2 } from "lucide-react";
import { defaultProductImages } from "../../../lib/mockData";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/table";

const DEFAULT_PRODUCT_IMAGE =
  defaultProductImages?.dogFood ||
  Object.values(defaultProductImages || {})[0] ||
  "";

// badge تبع المخزون
const renderStockBadge = (stock) => {
  let label = "In stock";
  let cls = "bg-green-50 text-green-700 border-green-200";

  if (stock === 0) {
    label = "Out of stock";
    cls = "bg-red-50 text-red-700 border-red-200";
  } else if (stock > 0 && stock <= 10) {
    label = "Low stock";
    cls = "bg-orange-50 text-orange-700 border-orange-200";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${cls}`}
    >
      {label} ({stock})
    </span>
  );
};

const getProductImage = (product) => {
  return product.image_url || DEFAULT_PRODUCT_IMAGE;
};

const ProductTable = ({ products, onView, onEdit, onDelete }) => {
  return (
    <div className="relative w-full overflow-auto bg-white rounded-lg border border-gray-200">
      <Table className="w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id} className="hover:bg-gray-50">
              {/* صورة + اسم + وصف قصير */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={getProductImage(p)}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_PRODUCT_IMAGE;
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {p.name}
                    </div>
                    {p.description && (
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {p.description}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>

              {/* Category */}
              <TableCell>
                <span className="inline-flex px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200 text-xs">
                  {p.category || "Uncategorized"}
                </span>
              </TableCell>

              {/* Price */}
              <TableCell>${Number(p.price).toFixed(2)}</TableCell>

              {/* Stock */}
              <TableCell>
                {renderStockBadge(p.stock_quantity ?? 0)}
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="View product"
                    onClick={() => onView?.(p)}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                    title="Edit product"
                    onClick={() => onEdit?.(p)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Delete product"
                    onClick={() => onDelete?.(p)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {products.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="px-4 py-6 text-center text-gray-500"
              >
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;
