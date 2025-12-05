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

import {
  useGetProductsQuery,
  useCreateProductMutation,
} from "../../../features/product/productApiSlice";

const AddProductPage = () => {
  const navigate = useNavigate();

  // 🟣 نجيب المنتجات عشان نستخرج الكاتيجوري اللي جاية من الـ API
  const { data: productsResponse } = useGetProductsQuery();

  // 🟣 ميوتشن إنشاء المنتج
  const [createProduct, { isLoading: isSubmitting }] =
    useCreateProductMutation();

  /**
   * 🟣 نجهز:
   * - categories: مصفوفة نصوص (labels) تروح للفورم
   * - categoryNameToId: Map من label -> id
   */
  const { categories, categoryNameToId } = useMemo(() => {
    const apiProducts = productsResponse?.data ?? [];

    const map = new Map();
    const labels = [];

    apiProducts.forEach((p) => {
      // متوقع من الـ API يكون هيك:
      // "category": { "id", "name", "name_en", "name_ar" }
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
  }, [productsResponse]);

  // 🟣 handler تبع السبميت - نحول قيم الفورم لـ body اللي Laravel بدو ياه
  const handleCreateProduct = async (formValues) => {
    console.log("✅ ProductForm values =>", formValues);

    // 👈 اسم الكاتيجوري من الفورم
    const selectedCategoryLabel =
      formValues.category ??
      formValues.product_category ??
      formValues.category_name ??
      "";

    const categoryId =
      formValues.product_category_id ??
      formValues.category_id ??
      categoryNameToId.get(selectedCategoryLabel) ??
      null;

    if (!categoryId) {
      alert("Please select a valid category");
      return;
    }

    // 👈 الفورم عندك يرجع فقط: name
    const name =
      formValues.name ??
      formValues.name_en ??
      formValues.nameEn ??
      formValues.en_name ??
      "";

    if (!name || !name.trim()) {
      alert("Product name is required");
      return;
    }

    const stockQty =
      formValues.stock_quantity ??
      formValues.stockQuantity ??
      formValues.stock ??
      0;

    const price =
      formValues.price ??
      formValues.price_amount ??
      0;

    const payload = {
      product_category_id: Number(categoryId),
      name_en: name, // 👈 هسا مو فاضي
      name_ar: name, // لو حاب تعمل حقل منفصل عربي منعدلها بعدين
      description:
        formValues.description ??
        formValues.desc ??
        "",
      stock_quantity: Number(stockQty),
      price: Number(price),
      is_active: formValues.is_active ? 1 : 0, // boolean → 0/1
    };

    console.log("📦 Payload to API =>", payload);

    try {
      await createProduct(payload).unwrap();
      navigate("/dashboard/store-management");
    } catch (error) {
      console.error("Failed to add product:", error);

      // لو فيه رسائل فاليديشين من Laravel، اعرض أول رسالة
      if (error?.data?.errors) {
        const firstKey = Object.keys(error.data.errors)[0];
        alert(error.data.errors[firstKey][0]);
      } else {
        alert("Failed to add product. Please try again.");
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

      {/* Page title card */}
      <Card className="shadow-sm border border-slate-100 bg-white/80">
        <CardHeader className="flex flex-col items-center gap-3 py-6">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-indigo-500/5 to-indigo-500/25 flex items-center justify-center border border-indigo-100 shadow-sm">
              <PackagePlus className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-slate-900">
              Add new product
            </CardTitle>
            <p className="text-sm text-slate-500">
              Create a new product in the store. Images are stored locally
              until the API is ready.
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Form card */}
      <Card className="shadow-sm border border-slate-100 bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-xs">
              <PackagePlus className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Product information
              </CardTitle>
              <p className="text-sm text-slate-500">
                Fill in the product details and upload up to 5 images.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <ProductForm
            key="create-product"
            mode="create"
            initialData={{}}
            onSubmit={handleCreateProduct}
            isSubmitting={isSubmitting}
            categories={categories} // 👈 مهم هون
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProductPage;
