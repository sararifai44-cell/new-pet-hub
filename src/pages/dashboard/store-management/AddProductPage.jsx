// src/pages/dashboard/store-management/AddProductPage.jsx

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PackagePlus } from "lucide-react";

import ProductForm from "../../../features/product/components/ProductForm";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";

import { useCreateProductMutation } from "../../../features/product/productApiSlice";
import { useGetProductCategoriesQuery } from "../../../features/productCategory/productCategoryApiSlice";

const AddProductPage = () => {
  const navigate = useNavigate();

  const {
    data: categoriesResponse,
    isLoading: isCategoriesLoading,
  } = useGetProductCategoriesQuery();

  const [createProduct, { isLoading: isSubmitting }] =
    useCreateProductMutation();

  const categories = useMemo(() => {
    if (!categoriesResponse) return [];
    return categoriesResponse.data ?? categoriesResponse;
  }, [categoriesResponse]);

  const isLoadingData = isCategoriesLoading;

  const handleCreateProduct = async (formData) => {
    try {
      console.log("data from form (add):", formData);

      const payload = {
        product_category_id: formData.product_category_id,
        name_en: formData.name_en,
        name_ar: formData.name_ar,
        description: formData.description ?? "",
        stock_quantity: Number(formData.stock),
        price: Number(formData.price),
        is_active: formData.is_active ?? true,
      };

      console.log("payload to API (add):", payload);

      await createProduct(payload).unwrap();

      navigate("/dashboard/store-management/products");
    } catch (error) {
      console.error("Failed to create product:", error);
      console.log("Backend validation (create):", error?.data);
    }
  };

  if (isLoadingData) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card className="shadow-sm border border-slate-100 bg-white">
          <CardContent className="py-10">
            <p className="text-center text-gray-500">
              Loading form data...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50"
          onClick={() =>
            navigate("/dashboard/store-management/products")
          }
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Button>
      </div>

      {/* Page header card */}
      <Card className="shadow-sm border border-slate-100 bg-white/80">
        <CardHeader className="flex flex-col items-center gap-3 py-6">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-emerald-500/5 to-emerald-500/25 flex items-center justify-center border border-emerald-100 shadow-sm">
              <PackagePlus className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          <div className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-slate-900">
              Add New Product
            </CardTitle>
            <p className="text-sm text-slate-500">
              Create a new product in the store catalog
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Form card */}
      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-xs">
              <PackagePlus className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Product Information
              </CardTitle>
              <p className="text-sm text-slate-500">
                Fill in the details of the new product
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <ProductForm
            categories={categories}
            onSubmit={handleCreateProduct}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductPage;
