import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  PackageOpen,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";

import ProductTable from "../../../features/product/components/ProductTable";
import ProductFilters from "../../../features/product/components/ProductFilters";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../../features/product/productApiSlice";

import { useGetProductCategoriesQuery } from "../../../features/productCategory/productCategoryApiSlice";

import ConfirmDeleteDialog from "../../../components/ui/confirm-delete-dialog";

const ProductListPage = () => {
  const navigate = useNavigate();

  const {
    data: productsResponse,
    isLoading,
    isError,
  } = useGetProductsQuery();

  const {
    data: categoriesResponse,
    isLoading: isCategoriesLoading,
  } = useGetProductCategoriesQuery();

  const [deleteProduct, { isLoading: isDeleting }] =
    useDeleteProductMutation();

  // ✅ Filters
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    is_active: "",
    stock: "",
    minPrice: "",
    maxPrice: "",
  });

  const resetFilters = () =>
    setFilters({
      search: "",
      category: "",
      is_active: "",
      stock: "",
      minPrice: "",
      maxPrice: "",
    });

  // ✅ Products data
  const products = useMemo(() => {
    if (!productsResponse) return [];
    return productsResponse.data ?? productsResponse;
  }, [productsResponse]);

  // ✅ Categories data
  const categories = useMemo(() => {
    if (!categoriesResponse) return [];
    return categoriesResponse.data ?? categoriesResponse;
  }, [categoriesResponse]);

  // ✅ Stats (للبار العلوي)
  const stats = useMemo(() => {
    const total = products.length;

    const inStock = products.filter(
      (p) => Number(p.stock) > 0
    ).length;

    const lowStock = products.filter((p) => {
      const s = Number(p.stock);
      return s > 0 && s <= 10;
    }).length;

    const outOfStock = products.filter(
      (p) => !p.stock || Number(p.stock) <= 0
    ).length;

    return {
      total,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [products]);

  // ✅ Apply filters
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    return products.filter((product) => {
      const search = filters.search?.toLowerCase().trim();

      if (search) {
        const text = [
          product.name,
          product.name_en,
          product.name_ar,
          product.description,
          product.category?.name,
          product.category?.name_en,
          product.category?.name_ar,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!text.includes(search)) return false;
      }

      // Category
      if (filters.category) {
        if (product.category?.id !== Number(filters.category)) {
          return false;
        }
      }

      // Active
      if (filters.is_active === "active" && !product.is_active) {
        return false;
      }
      if (filters.is_active === "inactive" && product.is_active) {
        return false;
      }

      // Stock
      if (filters.stock === "in-stock" && !(product.stock > 0)) {
        return false;
      }
      if (filters.stock === "out-of-stock" && product.stock > 0) {
        return false;
      }

      // Price
      const price = parseFloat(product.price);
      if (filters.minPrice) {
        const min = parseFloat(filters.minPrice);
        if (!Number.isNaN(min) && !Number.isNaN(price) && price < min) {
          return false;
        }
      }
      if (filters.maxPrice) {
        const max = parseFloat(filters.maxPrice);
        if (!Number.isNaN(max) && !Number.isNaN(price) && price > max) {
          return false;
        }
      }

      return true;
    });
  }, [products, filters]);

  // ✅ Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddProduct = () => {
    navigate("/dashboard/store-management/products/add");
  };

  const handleViewProduct = (product) => {
    navigate(`/dashboard/store-management/products/${product.id}`);
  };

  const handleEditProduct = (product) => {
    navigate(
      `/dashboard/store-management/products/edit/${product.id}`
    );
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
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

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header + actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Store Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage store products.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleAddProduct}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* 🔹 Compact stats bar (مثل الصورة) */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total products */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-violet-200 bg-violet-50 flex items-center justify-center">
                <PackageOpen className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Total Products
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {stats.total}
                </p>
              </div>
            </div>

            {/* In stock */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-emerald-200 bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  In Stock (&gt; 0)
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {stats.inStock}
                </p>
              </div>
            </div>

            {/* Low stock */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-amber-200 bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Low Stock (≤ 10)
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {stats.lowStock}
                </p>
              </div>
            </div>

            {/* Out of stock */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-red-200 bg-red-50 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                  Out of Stock
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {stats.outOfStock}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🔍 Filters */}
      <ProductFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={resetFilters}
        categories={categories}
        showSearch={true}
      />

      {/* Table card */}
      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Products List
          </CardTitle>
          {(isDeleting || isCategoriesLoading) && (
            <span className="text-xs text-slate-400">
              {isDeleting ? "Deleting..." : "Loading categories..."}
            </span>
          )}
        </CardHeader>

        <CardContent className="pt-4">
          {isLoading ? (
            <p className="text-center text-gray-500 py-8">
              Loading products...
            </p>
          ) : isError ? (
            <p className="text-center text-red-500 py-8">
              Failed to load products.
            </p>
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

      {/* 🔴 Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setSelectedProduct(null);
        }}
        entityLabel="product"
        name={
          selectedProduct?.name_en ||
          selectedProduct?.name ||
          ""
        }
        description="This action cannot be undone. This will permanently delete the product from the system."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ProductListPage;
