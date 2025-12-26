// src/pages/dashboard/store-management/AddProductPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PackagePlus } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

import ProductForm from "../../../features/product/components/ProductForm";
import { useCreateProductMutation } from "../../../features/product/productApiSlice";
import { useGetProductCategoriesQuery } from "../../../features/productCategory/productCategoryApiSlice";
import { useGetPetTypesQuery } from "../../../features/petType/petTypeApiSlice";

export default function AddProductPage() {
  const navigate = useNavigate();

  const { data: catRes, isLoading: loadingCats } = useGetProductCategoriesQuery();
  const { data: typesRes, isLoading: loadingTypes } = useGetPetTypesQuery();

  const categories = catRes?.data ?? [];
  const petTypes = typesRes?.data ?? [];

  const [createProduct, { isLoading: isSubmitting }] = useCreateProductMutation();

  const handleSubmit = async (formData) => {
    try {
      await createProduct(formData).unwrap();
      navigate("/dashboard/store-management/products");
    } catch (e) {
      console.error("Failed to create product:", e);
      console.log("Backend validation (create):", e?.data);
      alert(e?.data?.message || "Create failed");
    }
  };

  if (loadingCats || loadingTypes) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardContent className="py-10">
            <p className="text-center text-gray-500">Loading form data...</p>
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
            <PackagePlus className="w-6 h-6 text-emerald-600" />
            Add New Product
          </CardTitle>
          <p className="text-sm text-slate-500">Create a product and upload images</p>
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
            initialData={null}
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
