// src/pages/dashboard/store-management/EditProductPage.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

import ProductForm from "../../../features/product/components/ProductForm";
import { useGetProductQuery, useUpdateProductMutation } from "../../../features/product/productApiSlice";
import { useGetProductCategoriesQuery } from "../../../features/productCategory/productCategoryApiSlice";
import { useGetPetTypesQuery } from "../../../features/petType/petTypeApiSlice";

export default function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = Number(id);

  const { data: productRes, isLoading: loadingProduct, isError } = useGetProductQuery(productId, {
    skip: !productId,
  });
  const product = productRes?.data ?? productRes ?? null;

  const { data: catRes, isLoading: loadingCats } = useGetProductCategoriesQuery();
  const { data: typesRes, isLoading: loadingTypes } = useGetPetTypesQuery();

  const categories = catRes?.data ?? [];
  const petTypes = typesRes?.data ?? [];

  const [updateProduct, { isLoading: isSubmitting }] = useUpdateProductMutation();

  const handleSubmit = async (formData) => {
    try {
      await updateProduct({ id: productId, formData }).unwrap();
      navigate("/dashboard/store-management/products");
    } catch (e) {
      console.error("Failed to update product:", e);
      console.log("Backend validation (update):", e?.data);
      alert(e?.data?.message || "Update failed");
    }
  };

  if (loadingProduct || loadingCats || loadingTypes) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardContent className="py-10">
            <p className="text-center text-gray-500">Loading product data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardContent className="py-10 space-y-4 text-center">
            <p className="text-red-500 font-medium">Failed to load product.</p>
            <Button variant="outline" onClick={() => navigate("/dashboard/store-management/products")}>
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
          <CardTitle className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Edit Product
          </CardTitle>
          <p className="text-sm text-slate-500">Update product info and add images</p>
        </CardHeader>
      </Card>

      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Product Information
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <ProductForm
            initialData={product}
            categories={categories}
            petTypes={petTypes}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
