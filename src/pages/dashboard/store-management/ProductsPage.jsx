// src/pages/dashboard/store-management/ProductsPage.jsx
import React, { useState, useMemo } from "react";
import {
  Plus,
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ProductTable from "../../../features/product/components/ProductTable";
import ProductFilters from "../../../features/product/components/ProductFilters";

import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import ConfirmDeleteDialog from "../../../components/ui/confirm-delete-dialog";

// ⬅️ استخدم RTK Query بدل useProducts
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../../features/product/productApiSlice";

const ProductsPage = () => {
  const navigate = useNavigate();

  // 🟣 جلب المنتجات من الـ API
  const { data, isLoading, isError } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeletingFromApi }] =
    useDeleteProductMutation();

  // 🟣 تجهيز شكل المنتجات ليتناسب مع الجدول والفلترة
  const products = useMemo(() => {
    const apiProducts = data?.data ?? [];

    return apiProducts.map((p) => {
      const price = Number(p.price ?? 0);
      const stockQty = p.stock ?? 0; // ✅ عندك stock وليس stock_quantity

      // ✅ حوّل الكاتيجوري من object إلى نص
      const categoryName =
        p.category?.name_en ??
        p.category?.name_ar ??
        p.category?.name ??
        "Uncategorized";

      return {
        id: p.id,
        description: p.description ?? "",
        stock_quantity: stockQty,
        price,
        is_active: p.is_active,

        // اسم المنتج
        name: p.name_en ?? p.name_ar ?? "",
        name_en: p.name_en,
        name_ar: p.name_ar,

        // كاتيجوري
        category_id: p.category?.id,
        category: categoryName, // ✅ هنا string، مو object
      };
    });
  }, [data]);

  // 🟣 الفلاتر (أضفنا isActive)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    stockStatus: "",
    priceMin: "",
    priceMax: "",
    isActive: "", // "1" أو "0"
  });

  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ❗ خلط بين isDeletingProduct المحلي وحالة الـ mutation
  const isDeletingProduct = isDeletingFromApi;

  // 🟣 استخراج قائمة الكاتيجوري من البيانات
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // 🟣 إحصائيات سريعة
  const totalProducts = products.length;
  const inStockCount = products.filter(
    (p) => (p.stock_quantity ?? 0) > 0
  ).length;
  const lowStockCount = products.filter((p) => {
    const stock = p.stock_quantity ?? 0;
    return stock > 0 && stock <= 10;
  }).length;
  const outOfStockCount = products.filter(
    (p) => (p.stock_quantity ?? 0) === 0
  ).length;

  // 🟣 الفلترة داخل الريأكت (بما فيها isActive)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const stock = p.stock_quantity ?? 0;
      const price = Number(p.price ?? 0);

      // Search
      const search = filters.search.trim().toLowerCase();
      const matchesSearch =
        !search ||
        (p.name || "").toLowerCase().includes(search) ||
        (p.name_en || "").toLowerCase().includes(search) ||
        (p.name_ar || "").toLowerCase().includes(search) ||
        (p.description || "").toLowerCase().includes(search);

      // Category
      const matchesCategory =
        !filters.category || p.category === filters.category;

      // Stock status
      let matchesStock = true;
      if (filters.stockStatus === "in-stock") {
        matchesStock = stock > 0;
      } else if (filters.stockStatus === "low-stock") {
        matchesStock = stock > 0 && stock <= 10;
      } else if (filters.stockStatus === "out-of-stock") {
        matchesStock = stock === 0;
      }

      // isActive ("1" / "0")
      const matchesActive =
        !filters.isActive ||
        Number(p.is_active) === Number(filters.isActive);

      // Price
      const min =
        filters.priceMin !== "" ? Number(filters.priceMin) : null;
      const max =
        filters.priceMax !== "" ? Number(filters.priceMax) : null;

      const matchesPriceMin = min === null || price >= min;
      const matchesPriceMax = max === null || price <= max;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock &&
        matchesActive &&
        matchesPriceMin &&
        matchesPriceMax
      );
    });
  }, [products, filters]);

  const handleFiltersChange = (updater) => {
    setFilters((prev) =>
      typeof updater === "function" ? updater(prev) : updater
    );
  };

  const resetFilters = () =>
    setFilters({
      search: "",
      category: "",
      stockStatus: "",
      priceMin: "",
      priceMax: "",
      isActive: "",
    });

  const handleDeleteRequest = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleView = (product) => {
    navigate(`/dashboard/store-management/${product.id}`);
  };

  const handleEdit = (product) => {
    navigate(`/dashboard/store-management/edit/${product.id}`);
  };

  const handleAdd = () => {
    navigate("/dashboard/store-management/add");
  };

  // 🟣 حذف المنتج عبر الـ API
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id).unwrap();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Store Management
          </h1>
          <p className="text-gray-600 text-sm">
            Manage store products.
          </p>
        </div>

        <Button
          className="flex items-center gap-2"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Quick stats */}
      <Card className="shadow-sm border border-slate-100">
        <CardContent className="py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Total products
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  {totalProducts}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  In stock (&gt; 0)
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  {inStockCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Low stock (&le; 10)
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  {lowStockCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center border border-red-100">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Out of stock
                </p>
                <p className="text-xl font-semibold text-slate-900">
                  {outOfStockCount}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <ProductFilters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={resetFilters}
        categories={categories}
      />

      {/* Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>All Products</CardTitle>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredProducts.length} items
            </span>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading products...</p>
          ) : isError ? (
            <p className="text-sm text-red-500">
              Failed to load products.
            </p>
          ) : (
            <ProductTable
              products={filteredProducts}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
            />
          )}
        </CardContent>
      </Card>

      {/* Confirm delete dialog */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isDeletingProduct) {
            setIsDeleteDialogOpen(false);
            setProductToDelete(null);
          } else {
            setIsDeleteDialogOpen(open);
          }
        }}
        entityLabel="product"
        name={productToDelete?.name}
        isLoading={isDeletingProduct}
        onConfirm={confirmDeleteProduct}
      />
    </div>
  );
};

export default ProductsPage;
