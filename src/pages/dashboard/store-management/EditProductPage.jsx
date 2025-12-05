import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

import ProductForm from "../../../features/product/components/ProductForm";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";

import {
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../../features/product/productApiSlice";

const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = Number(id);

  // 🟣 نجيب كل المنتجات
  const { data: productsResponse } = useGetProductsQuery();
  const products = productsResponse?.data ?? [];

  // 🟣 mutation للتحديث
  const [updateProduct, { isLoading: isSubmitting }] =
    useUpdateProductMutation();

  // 🟣 المنتج المطلوب تعديله
  const product = useMemo(
    () => products.find((p) => p.id === productId) || null,
    [products, productId]
  );

  // 🟣 نجهز:
  // - categories: مصفوفة labels نصية
  // - categoryNameToId: Map من label -> id
  const { categories, categoryNameToId } = useMemo(() => {
    const map = new Map();
    const labels = [];

    products.forEach((p) => {
      const cat = p.category;
      if (!cat) return;

      const label =
        cat.name_en ?? cat.name_ar ?? cat.name ?? `Category #${cat.id}`;

      if (!map.has(label)) {
        map.set(label, cat.id);
        labels.push(label);
      }
    });

    return { categories: labels, categoryNameToId: map };
  }, [products]);

  // 🟣 initialData مناسب للفورم
  const initialFormData = useMemo(() => {
    if (!product) return {};

    const cat = product.category;
    const categoryLabel = cat
      ? cat.name_en ?? cat.name_ar ?? cat.name ?? `Category #${cat.id}`
      : "";

    return {
      // الحقول اللي الفورم يتوقعها
      name: product.name_en ?? product.name ?? "",
      category: categoryLabel,
      price: product.price ?? "",
      stock_quantity: product.stock_quantity ?? "",
      description: product.description ?? "",
      is_active:
        product.is_active === 1 || product.is_active === true,
      // لو حبيت تستخدم الصور لاحقًا
      images: [],
    };
  }, [product]);

  if (!product) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Card>
          <CardContent className="py-8 text-center space-y-3">
            <p className="text-lg font-semibold text-slate-900">
              Product not found
            </p>
            <p className="text-sm text-slate-500">
              The product you are looking for does not exist or has been
              removed.
            </p>
            <Button
              className="mt-2"
              variant="outline"
              onClick={() => navigate("/dashboard/store-management")}
            >
              Back to products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // helper صغير يختار القيمة الجديدة لو موجودة، غير هيك يرجع القديمة
  const pickValue = (newVal, oldVal) => {
    if (newVal === undefined || newVal === null) return oldVal;
    if (typeof newVal === "string" && newVal.trim() === "") return oldVal;
    return newVal;
  };

  // 🟣 handler تبع التحديث – يعدّل كل الحقول، ويترك الغير معدّلة مثل ما هي
  const handleUpdateProduct = async (formValues) => {
    try {
      console.log("🔹 Form values =>", formValues);

      // name_en: جاي من حقل name في الفورم
      const name_en =
        formValues.name && formValues.name.trim() !== ""
          ? formValues.name
          : product.name_en;

      // stock_quantity: لو فاضي نرجع للقيمة القديمة
      let stock_quantity;
      if (
        formValues.stock_quantity === undefined ||
        formValues.stock_quantity === null ||
        formValues.stock_quantity === ""
      ) {
        stock_quantity = product.stock_quantity;
      } else {
        stock_quantity = Number(formValues.stock_quantity);
      }

      // is_active: checkbox → boolean
      const is_active =
        formValues.is_active !== undefined
          ? !!formValues.is_active
          : product.is_active === 1 || product.is_active === true;

      const payload = {
        name_en,
        stock_quantity,
        is_active,
      };

      console.log("📦 Update payload =>", payload);

      await updateProduct({ id: productId, body: payload }).unwrap();

      navigate("/dashboard/store-management");
    } catch (error) {
      console.error("❌ Failed to update product:", error);
      if (error?.data?.errors) {
        const firstKey = Object.keys(error.data.errors)[0];
        alert(error.data.errors[firstKey][0]);
      } else {
        alert("Failed to update product. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50"
          onClick={() => navigate("/dashboard/store-management")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to products
        </Button>
      </div>

      {/* Title card */}
      <Card className="shadow-sm border border-slate-100 bg-white/80">
        <CardHeader className="flex flex-col items-center gap-3 py-6">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-indigo-500/5 to-indigo-500/25 flex items-center justify-center border border-indigo-100 shadow-sm">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-white" />
          </div>

          <div className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-slate-900">
              Edit product
            </CardTitle>
            <p className="text-sm text-slate-500">
              Update the product information and images.
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Form card */}
      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-xs">
              <Package className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Product information
              </CardTitle>
              <p className="text-sm text-slate-500">
                Edit the details and manage product photos.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <ProductForm
            key={productId}
            mode="edit"
            initialData={initialFormData}
            onSubmit={handleUpdateProduct}
            isSubmitting={isSubmitting}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductPage;
