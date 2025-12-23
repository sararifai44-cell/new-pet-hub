// src/pages/dashboard/store-management/EditProductPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

import ProductForm from "../../../features/product/components/ProductForm";
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";

import { useGetProductQuery, useUpdateProductMutation } from "../../../features/product/productApiSlice";
import { useGetProductCategoriesQuery } from "../../../features/productCategory/productCategoryApiSlice";

// ---- Helpers ----

const normalizeProduct = (p) => {
  if (!p) return null;

  const catId = p.category?.id ?? p.product_category_id ?? null;
  const stockQty = p.stock_quantity ?? p.stock ?? 0;

  return {
    id: p.id,
    name_en: p.name_en ?? "",
    name_ar: p.name_ar ?? "",
    product_category_id: catId ? String(catId) : "",
    price: p.price ?? "",
    // ✅ keep as string for the form inputs
    stock_quantity: String(stockQty ?? 0),
    description: p.description ?? "",
    is_active: !!p.is_active,
  };
};

const buildPartialPayload = (formData, original) => {
  const payload = {};
  if (!original) return payload;

  if ((formData.name_en ?? "") !== (original.name_en ?? "")) payload.name_en = formData.name_en ?? "";
  if ((formData.name_ar ?? "") !== (original.name_ar ?? "")) payload.name_ar = formData.name_ar ?? "";

  const newDesc = formData.description ?? "";
  const oldDesc = original.description ?? "";
  if (newDesc !== oldDesc) payload.description = newDesc;

  // Category
  const newCat = String(formData.product_category_id ?? "");
  const oldCat = String(original.product_category_id ?? "");
  if (newCat !== oldCat) {
    payload.product_category_id = newCat ? Number(newCat) : null;
  }

  // Price
  const newPrice = Number(formData.price);
  const oldPrice = Number(original.price);
  if (!Number.isNaN(newPrice) && newPrice !== oldPrice) payload.price = newPrice;

  // ✅ Stock (backend expects stock_quantity)
  const newStock = Number(formData.stock_quantity);
  const oldStock = Number(original.stock_quantity);
  if (!Number.isNaN(newStock) && newStock !== oldStock) payload.stock_quantity = newStock;

  // is_active
  if (!!formData.is_active !== !!original.is_active) payload.is_active = !!formData.is_active;

  return payload;
};

// ---- Component ----

const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = Number(id);

  const { data: productResponse, isLoading: isProductLoading, isError: isProductError } =
    useGetProductQuery(productId, { skip: !productId });

  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetProductCategoriesQuery();

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const product = useMemo(() => {
    if (!productResponse) return null;
    const raw = productResponse.data ?? productResponse;
    return normalizeProduct(raw);
  }, [productResponse]);

  const categories = useMemo(() => {
    if (!categoriesResponse) return [];
    return categoriesResponse.data ?? categoriesResponse;
  }, [categoriesResponse]);

  const isLoadingData = isProductLoading || isCategoriesLoading || isUpdating;

  const handleUpdateProduct = async (formData) => {
    try {
      const changes = buildPartialPayload(formData, product);

      if (Object.keys(changes).length === 0) {
        navigate("/dashboard/store-management/products");
        return;
      }

      const payload = { id: productId, ...changes };
      await updateProduct(payload).unwrap();

      navigate("/dashboard/store-management/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      console.log("Backend validation (update):", error?.data);
    }
  };

  if (isProductLoading || isCategoriesLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-center text-gray-500">Loading product data...</p>
      </div>
    );
  }

  if (isProductError) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardContent className="py-10 flex flex-col items-center gap-3">
            <p className="text-lg font-semibold text-slate-900">Failed to load product</p>
            <p className="text-sm text-slate-500 text-center max-w-md">
              Something went wrong while loading this product.
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => navigate("/dashboard/store-management/products")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardContent className="py-10 flex flex-col items-center gap-3">
            <p className="text-lg font-semibold text-slate-900">Product not found</p>
            <p className="text-sm text-slate-500 text-center max-w-md">
              The product you are trying to edit does not exist or may have been removed.
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => navigate("/dashboard/store-management/products")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50"
          onClick={() => navigate("/dashboard/store-management/products")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Button>
      </div>

      <Card className="shadow-sm border border-slate-100 bg-white/80">
        <CardHeader className="flex flex-col items-center gap-3 py-6">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 via-blue-500/5 to-blue-500/25 flex items-center justify-center border border-blue-100 shadow-sm">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-slate-900">Edit Product</CardTitle>
            <p className="text-sm text-slate-500">Update the information of the selected product</p>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-xs">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">Product Information</CardTitle>
              <p className="text-sm text-slate-500">Edit the basic information about the product</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <ProductForm
            initialData={product}
            categories={categories}
            onSubmit={handleUpdateProduct}
            isSubmitting={isLoadingData}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductPage;
