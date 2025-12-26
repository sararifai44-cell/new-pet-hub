// src/pages/dashboard/store-management/ProductListPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  PackageOpen,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

import ProductTable from "../../../features/product/components/ProductTable";
import ProductFilters from "../../../features/product/components/ProductFilters";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../../features/product/productApiSlice";

import { useGetProductCategoriesQuery } from "../../../features/productCategory/productCategoryApiSlice";
import { useGetPetTypesQuery } from "../../../features/petType/petTypeApiSlice";

import ConfirmDeleteDialog from "../../../components/ui/confirm-delete-dialog";

export default function ProductListPage() {
  const navigate = useNavigate();

  const { data: productsRes, isLoading, isError } = useGetProductsQuery();
  const products = productsRes?.data ?? [];

  const { data: categoriesRes } = useGetProductCategoriesQuery();
  const categories = categoriesRes?.data ?? [];

  // ✅ Pet Types للفلتر
  const { data: petTypesRes } = useGetPetTypesQuery();
  const petTypes = petTypesRes?.data ?? [];

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [filters, setFilters] = useState({
    search: "",
    pet_type: "",     // ✅ جديد
    category: "",
    is_active: "",
    stock: "",
  });

  const filteredProducts = useMemo(() => {
    const search = (filters.search || "").trim().toLowerCase();

    const petTypeId = filters.pet_type ? Number(filters.pet_type) : null;
    const categoryId = filters.category ? Number(filters.category) : null;

    return (products || []).filter((p) => {
      // Search
      if (search) {
        const text = [
          p.name,
          p.name_en,
          p.name_ar,
          p.description,
          p.category?.name,
          p.category?.name_en,
          p.category?.name_ar,
          p.pet_type?.name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!text.includes(search)) return false;
      }

      // ✅ Pet Type filter
      if (petTypeId) {
        const pid = Number(p.pet_type?.id ?? p.pet_type_id ?? 0);
        if (pid !== petTypeId) return false;
      }

      // Category
      if (categoryId) {
        const cid = Number(p.category?.id ?? p.product_category_id ?? 0);
        if (cid !== categoryId) return false;
      }

      // Active
      if (filters.is_active === "active" && !p.is_active) return false;
      if (filters.is_active === "inactive" && p.is_active) return false;

      // Stock
      const stockQty = Number(p.stock_quantity ?? 0);
      if (filters.stock === "in-stock" && !(stockQty > 0)) return false;
      if (filters.stock === "out-of-stock" && stockQty > 0) return false;

      return true;
    });
  }, [products, filters]);

  const stats = useMemo(() => {
    const list = products || [];
    const total = list.length;
    const active = list.filter((p) => !!p.is_active).length;

    const lowStock = list.filter((p) => {
      const s = Number(p.stock_quantity ?? 0);
      return s > 0 && s <= 10;
    }).length;

    const outOfStock = list.filter((p) => Number(p.stock_quantity ?? 0) === 0).length;

    return { total, active, lowStock, outOfStock };
  }, [products]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddProduct = () => navigate("/dashboard/store-management/products/add");
  const handleViewProduct = (p) => navigate(`/dashboard/store-management/products/${p.id}`);
  const handleEditProduct = (p) => navigate(`/dashboard/store-management/products/edit/${p.id}`);

  const handleDeleteClick = (p) => {
    setSelectedProduct(p);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct.id).unwrap();
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      pet_type: "",
      category: "",
      is_active: "",
      stock: "",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Store Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage store products.</p>
        </div>

        <div className="flex gap-2">
          <Button type="button" onClick={handleAddProduct} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-violet-200 bg-violet-50 flex items-center justify-center">
                <PackageOpen className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Total Products
                </p>
                <p className="text-lg font-semibold text-slate-900">{stats.total}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-emerald-200 bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Active
                </p>
                <p className="text-lg font-semibold text-slate-900">{stats.active}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-amber-200 bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Low Stock
                </p>
                <p className="text-lg font-semibold text-slate-900">{stats.lowStock}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-rose-200 bg-rose-50 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Out of Stock
                </p>
                <p className="text-lg font-semibold text-slate-900">{stats.outOfStock}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProductFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={resetFilters}
        categories={categories}
        petTypes={petTypes}   // ✅ تمرير Pet Types
      />

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products List</CardTitle>
          {isDeleting && <span className="text-xs text-slate-400">Deleting...</span>}
        </CardHeader>

        <CardContent className="pt-4">
          {isLoading ? (
            <p className="text-center text-gray-500 py-8">Loading products...</p>
          ) : isError ? (
            <p className="text-center text-red-500 py-8">Failed to load products.</p>
          ) : (
            <ProductTable
              products={filteredProducts}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteClick}
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setSelectedProduct(null);
        }}
        entityLabel="product"
        name={selectedProduct?.name_en || selectedProduct?.name || ""}
        description="This action cannot be undone. This will permanently delete the product from the system."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
